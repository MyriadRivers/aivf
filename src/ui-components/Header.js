import styled from "styled-components";

const StyledHeader = styled.div`
    font-size: 40pt;
    color: #38b561;
`;

const Header = ({text}) => {
    return (
        <StyledHeader>
            {text}
        </StyledHeader>
    )
}

export default Header;