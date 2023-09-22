import styled from "styled-components";

const StyledButton = styled.button`
    background-color: #38b561;
    color: white;
    height: 50px;
    font-size: 20pt;
    width: 200px;
    border: 0px;
    border-radius: 30px;
    font-weight: bold;
`

const Button = ({onClick, text, disabled}) => {
    return (
        <StyledButton onClick={onClick} disabled={disabled}>
            {text}
        </StyledButton>
    )
}

export default Button;