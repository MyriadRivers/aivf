import styled from "styled-components";

const StyledButton = styled.button`
    background-color: #38b561;
    color: white;
    font-size: 20pt;
    width: 175px;
    border: 0px;
    border-radius: 30px;

    &:active {
        background-color: #30814a;
    }

    &:hover:enabled {
        cursor: pointer;
    }

    &:disabled {
        background-color: grey;
    }
`

const Button = ({onClick, text, disabled}) => {
    return (
        <StyledButton onClick={onClick} disabled={disabled}>
            {text}
        </StyledButton>
    )
}

export default Button;