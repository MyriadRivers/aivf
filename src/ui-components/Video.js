import { useEffect, useRef } from "react";

const Video = ({url}) => {
    const videoRef = useRef();
    useEffect(() => {    
        videoRef.current?.load();
    }, [url]);

    return (
        <div>
            <video ref={videoRef} style={{maxWidth: `${window.innerWidth - 50}px`}} controls>
                <source src={url} />
            </video>
            <br/>
            <a href={url} download>Download video</a>
        </div>
        
    )
}

export default Video