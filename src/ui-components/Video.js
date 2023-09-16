import { useEffect, useRef } from "react";

const Video = ({url}) => {
    const videoRef = useRef();
    useEffect(() => {    
        videoRef.current?.load();
    }, [url]);

    return (
        <video ref={videoRef} style={{maxWidth: `${window.innerWidth - 50}px`}} controls>
          <source src={url} />
          <a href={url} download>Download video</a>
        </video>
    )
}

export default Video