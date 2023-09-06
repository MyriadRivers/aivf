import { useEffect, useRef } from "react";

const Video = ({url}) => {
    const videoRef = useRef();

    useEffect(() => {    
        videoRef.current?.load();
    }, [url]);

    return (
        <video ref={videoRef} controls>
          <source src={url} />
        </video>
    )
}

export default Video