import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Loader,
} from "@aws-amplify/ui-react";
import { useEffect, useRef, useState } from "react";
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";

import * as subscriptions from "./graphql/subscriptions"
import * as mutations from "./graphql/mutations"
import Video from "./ui-components/Video";

import { getInfo } from "react-mediainfo"

import aivf_logo from "./resources/aivf_logo.gif"
import styled from "styled-components";
import GlobalStyle from "./globalStyles";
import Header from "./ui-components/Header";
import Button from "./ui-components/Button";
import Library from "./ui-components/Library";
import UserBar from "./ui-components/UserBar";

const PAGE_SIZE = 5;

const AppStyled = styled.div`
  margin: 5%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .home {
    width: 200px;
  }
  .header{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  input[type=file] {
    font-size: initial
  }
`

function App({ signOut }) {
  const fileInputRef = useRef();
  const [video, setVideo] = useState();
  const [hasSound, setSound] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false)

  const [objID, setObjID] = useState("");
  const [objKey, setObjKey] = useState("");
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("")

  const [URL, setURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadDisabled, setUploadDisabled] = useState(false);

  const [libraryResults, setLibraryResults] = useState([]);
  const [libraryHasNext, setLibraryHasNext] = useState(false);
  const [libraryNextToken, setLibraryNextToken] = useState("");
  const [libraryVisible, setLibraryVisible] = useState(false);
  
  const handleFileChange = async (e) => {

    let file = e.target.files[0];

    let fileInfo = await getInfo(file)
     console.log(fileInfo)
    if ("VideoCount" in fileInfo.media.track[0] && fileInfo.media.track[0].Duration <= 90) {
      setVideo(file);
    } else {
      fileInputRef.current.value = null;
      alert("Please upload a video file no longer than 90 seconds long.")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadDisabled(true)
    console.log("submitting...")

    let currUser = await Auth.currentUserInfo();
    setUser(currUser.id)
    let objectPrefix = `private/${currUser.id}/`

    if (video) {

      let objectKey = objectPrefix + video.name;
      setObjKey(objectKey)
      let id = crypto.randomUUID();
      setObjID(id)

      await Storage.put(video.name, video, {
        progressCallback(progress) {
          let percentUploaded = Math.round(progress.loaded / progress.total * 100);
          setUploadProgress(percentUploaded !== 100 ? percentUploaded : null);
        },
        level: "private"
      });
      setUploadFinished(true)
      setURL(window.URL.createObjectURL(video))
      setSound(false)

      // Send the request for the video to be processed
      await API.graphql(
        graphqlOperation(mutations.requestVideo, {id: id, name: objectKey, owner: currUser.id})
      );
      console.log(id)
      console.log("Requesting video with parameters: " + String(id) + " " +  String(objectKey) + " " + String(currUser.id))
    }
    
  }

  const showLibrary = async () => {
    let results = await Storage.list("", {level: "private", pageSize: PAGE_SIZE});
    // results = results.results.filter((obj) => obj.key.substring(0, obj.key.lastIndexOf(".")).endsWith("_processed"));
    setLibraryResults(results.results);
    setLibraryHasNext(results.hasNextToken);
    setLibraryNextToken(results.nextToken);
  }

  const expandLibrary = async () => {
    if (libraryHasNext) {
      let response = await Storage.list("", {level: "private", pageSize: PAGE_SIZE, nextToken: libraryNextToken});
      if (response.hasNextToken) {
        setLibraryNextToken(response.nextToken)
      } else {
        setLibraryNextToken(undefined)
        setLibraryHasNext(false)
      }
      let expandedLibraryResults = [...libraryResults, ...response.results]

      console.log(expandedLibraryResults)
      setLibraryResults(expandedLibraryResults)
    }
  }

  const updateLibrary = async () => {
    await Storage.remove(video.name, {level: "private"});
    showLibrary()
  }

  const getUsername = async () => {
    let info = await Auth.currentUserInfo();
    setUsername(info.username)
  }
  
  useEffect(() => {
    getUsername()
    showLibrary()

    console.log("Awaiting add video with parameters: " + String(objID) + " " + String(objKey) + " " + String(user))
    API.graphql(
      graphqlOperation(subscriptions.addedVideo, {id: objID, name: objKey, owner: user})
    ).subscribe({
      next: ({provider, value}) => {
        console.log("Received: " + JSON.stringify(value.data.addedVideo));
        let newURL = value.data.addedVideo.url;
        // Remove the unprocessed image from S3 to save space
        updateLibrary();

        setUploadFinished(false);
        setSound(true);
        setURL(newURL);
        setUploadDisabled(false);
      },
      error: (error) => console.warn(error),
    });
  }, [objKey, user, objID])

  return (
    <AppStyled className="App">
      <GlobalStyle />
      <div className="header">
        <a href="https://aivf.co/" className="home"><img src={aivf_logo} width={200} alt="AIVF logo"/></a>
        <UserBar username={username} signout={signOut}/>
      </div>
      <Header text={"Video Sonification"}></Header>
      Automatically generate music for any video you upload. Powered by AI.
      <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
      {uploadProgress != null && <div>uploading... {uploadProgress}%</div>}
      {uploadFinished && <Loader/>}
      {uploadFinished && "Generating music..."}
      {uploadProgress == null && !uploadDisabled && URL && "Video sonified!"}
      {URL !== "" && <Video url={URL} hasSound={hasSound}/>}
      <Button onClick={handleSubmit} text={"Upload"} disabled={uploadDisabled || video === undefined} />
      <Button onClick={() => {
          showLibrary();
          setLibraryVisible(!libraryVisible)
        }} text={"Library"} />
      {libraryVisible &&
      <Library items={libraryResults} showMore={expandLibrary} setVideo={setURL} setSound={setSound} hasMore={libraryHasNext}/>}
    </AppStyled>
  );
}

export default withAuthenticator(App);