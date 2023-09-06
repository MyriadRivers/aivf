import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  View,
  Card,
  Loader,
} from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";

import * as subscriptions from "./graphql/subscriptions"
import * as mutations from "./graphql/mutations"
import Video from "./ui-components/Video";

function App({ signOut }) {
  const [video, setVideo] = useState();

  const [objKey, setObjKey] = useState("");
  const [user, setUser] = useState("");

  const [URL, setURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadDisabled, setUploadDisabled] = useState(false);
  
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
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

      await Storage.put(video.name, video, {
        progressCallback(progress) {
          let percentUploaded = Math.round(progress.loaded / progress.total * 100);
          setUploadProgress(percentUploaded !== 100 ? percentUploaded : null);
        },
        level: "private"
      });

      // Send the request for the video to be processed
      await API.graphql(
        graphqlOperation(mutations.requestVideo, {name: objectKey, owner: currUser.id})
      );
    }
    
  }

  useEffect(() => {
    API.graphql(
      graphqlOperation(subscriptions.addedVideo, {name: objKey, owner: user})
    ).subscribe({
      next: ({provider, value}) => {
        console.log("Received: " + JSON.stringify(value.data.addedVideo))
        let newURL = value.data.addedVideo.url
        setURL(newURL);
        setUploadDisabled(false)
      },
      error: (error) => console.warn(error),
    });
  }, [objKey, user])

  return (
    <View className="App">
      <Card>
        <Heading level={1}>Video Sonification</Heading>
        <br/>
        <br/>
        <input type="file" onChange={handleFileChange}/>
        <br/>
        <br/>
        <button onClick={handleSubmit} disabled={uploadDisabled || video === undefined}>Upload</button>
        <br/>
        <br/>
        {uploadProgress != null && <div>uploading... {uploadProgress}%</div>}
        <br/>
        <br/>
        {uploadProgress == null && uploadDisabled && <Loader/>}
        <br/>
        {URL !== "" && <Video url={URL}/>}
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);