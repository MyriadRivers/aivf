import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledVideo = styled.div`

    a {
        background-color: #3ca7f5;
        color: white;
        text-decoration: none;
        font-weight: bold;
        display: flex;
        width: 200px;
        height: 50px;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
    }
`

const Video = ({url, sound}) => {
    const videoRef = useRef();
    useEffect(() => {    
        videoRef.current?.load();
        videoRef.current?.play().catch((e) => {
            console.log(e)
        });
    }, [url]);

    return (
        <StyledVideo>
            <video ref={videoRef} style={{maxWidth: `${window.innerWidth - 50}px`}} muted={!sound} controls>
                <source src={url} />
            </video>
            <br/>
            {sound && <a href={url} download>Download</a>}
        </StyledVideo>   
    )
}

export default Video