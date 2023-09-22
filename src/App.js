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

const AppStyled = styled.div`
  margin: 5%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .home {
    width: 200px;
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

  const [URL, setURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadDisabled, setUploadDisabled] = useState(false);
  
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

  useEffect(() => {
    console.log("Awaiting add video with parameters: " + String(objID) + " " + String(objKey) + " " + String(user))
    API.graphql(
      graphqlOperation(subscriptions.addedVideo, {id: objID, name: objKey, owner: user})
    ).subscribe({
      next: ({provider, value}) => {
        console.log("Received: " + JSON.stringify(value.data.addedVideo))
        let newURL = value.data.addedVideo.url
        setUploadFinished(false)
        setSound(true)
        setURL(newURL);
        setUploadDisabled(false)
      },
      error: (error) => console.warn(error),
    });
  }, [objKey, user, objID])

  return (
    <AppStyled className="App">
      <GlobalStyle />
      <a href="https://aivf.co/" className="home"><img src={aivf_logo} width={200} alt="AIVF logo"/></a>
      <Header text={"Video Sonification"}></Header>
      Automatically generate music for any video you upload. Powered by AI.
      <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
      {uploadProgress != null && <div>uploading... {uploadProgress}%</div>}
      {uploadFinished && <Loader/>}
      {uploadFinished && "Generating music..."}
      {uploadProgress == null && !uploadDisabled && URL && "Video sonified!"}
      {URL !== "" && <Video url={URL} hasSound={hasSound}/>}
      <Button onClick={handleSubmit} text={"Upload"} disabled={uploadDisabled || video === undefined} />
      <Button onClick={signOut} text={"Sign Out"}/>
    </AppStyled>
  );
}

export default withAuthenticator(App);