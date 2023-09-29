import styled from "styled-components"

const StyledUserBar = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    button {
        background-color: white;
        color: #40a8f5;
        border: none;

        &:hover {
            cursor: pointer;
        }
    }
`

const UserBar = ({username, signout}) => {
    return (
        <StyledUserBar>
            {username}
            <button onClick={signout}>Sign out</button>
        </StyledUserBar>
    )
}

export default UserBar;