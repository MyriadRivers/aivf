import { Storage } from "aws-amplify"
import styled from "styled-components"

const StyledLibraryItem = styled.div`
    background-color: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: center;

    video {
        &:hover {
            cursor: pointer;
        }
    }

    button {
        color: red;
        background-color: lightgrey;
        border: none;

        &:hover {
            cursor: pointer;
        }
    }
`

const LibraryItem = ({url, objkey, remove, onClick}) => {

    const updateLibrary = async () => {
        const deleteItem = async () => {
            await Storage.remove(objkey, {level: "private"});
        }
        await deleteItem();
        remove();
    }

    return (
        <StyledLibraryItem>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <video src={url+"#t"} width={"250px"} height={"250px"} onClick={onClick}></video>
            <button onClick={updateLibrary}><i class="fa fa-remove"></i></button>
        </StyledLibraryItem>
    )
}

export default LibraryItem;