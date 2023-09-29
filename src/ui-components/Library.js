import { Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LibraryItem from "./LibraryItem";

const StyledLibrary = styled.div`
    background-color: lightgrey;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    

    video {
        background-color: black;
    }

    .videoHolder {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        background-color: lightgrey;
        max-width: 1500px;
    }

    .showMore {
        background-color: #38b561;
        width: 125px;
        color: white;
        border: none;
        
        &:hover:enabled {
            cursor: pointer;
        }

        &:disabled {
            background-color: grey;
            color: lightgrey;
        }
    }
`

const Library = ({items, showMore, setVideo, setSound, hasMore}) => {
    const [itemURLs, setItemURLs] = useState([]);

    const getURLs = async () => {
        var urls = []

        const updateURLs = async () => {
            items.forEach(async (obj) => {
                let url = await Storage.get(obj.key, {
                    level: "private"
                })
                let signedURL = {
                    key: obj.key,
                    url: url
                }
                urls.push(signedURL)
            });
        }
        await updateURLs();
        setItemURLs(urls)
    }

    const deleteURL = (index) => {
        let newURLs = [...itemURLs];
        newURLs.splice(index, 1);
        setItemURLs(newURLs);
    }

    useEffect(() => {
        getURLs()
    }, [items])

    return (
        <StyledLibrary>
            <div className="videoHolder">
                {itemURLs &&
                itemURLs.map((url, i) => {
                    return (
                        <LibraryItem key={i} objkey={url.key} url={url.url} remove={() => deleteURL(i)} onClick={() => {
                            setVideo(url.url);
                            setSound(true);
                        }}/>
                    )
                })}
            </div>
            <div><button className="showMore" onClick={showMore} disabled={!hasMore}>More</button></div>
        </StyledLibrary>
    )
}

export default Library;