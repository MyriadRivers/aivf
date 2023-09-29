import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledVideo = styled.div`

    a {
        background-color: #3ca7f5;
        color: white;
        text-decoration: none;
        display: flex;
        width: 175px;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
    }
`

const Video = ({url, hasSound}) => {
    const videoRef = useRef();
    useEffect(() => {    
        videoRef.current?.load();
        if (videoRef.current?.paused) {
            videoRef.current?.play().catch((e) => {
                console.log(e)
            });
        }
    }, [url]);

    return (
        <StyledVideo>
            <video ref={videoRef} style={{maxWidth: `${window.innerWidth - 50}px`}} muted={!hasSound} controls>
                <source src={url} />
            </video>
            <br/>
            {hasSound && <a href={url} download>Download</a>}
        </StyledVideo>   
    )
}

export default Video