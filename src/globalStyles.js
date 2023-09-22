import { createGlobalStyle } from "styled-components";
import MarlinSoftBasicEot from "./resources/fonts/MarlinSoftBasic-Regular.eot"
import MarlinSoftBasicSvg from "./resources/fonts/MarlinSoftBasic-Regular.svg"
import MarlinSoftBasicTtf from "./resources/fonts/MarlinSoftBasic-Regular.ttf"
import MarlinSoftBasicWoff from "./resources/fonts/MarlinSoftBasic-Regular.woff"
import MarlinSoftBasicWoff2 from "./resources/fonts/MarlinSoftBasic-Regular.woff2"

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: "Marlin Soft Basic";
        src: url(${MarlinSoftBasicEot}) format("embedded-opentype"),
             url(${MarlinSoftBasicSvg}) format("svg"),
             url(${MarlinSoftBasicTtf}) format("truetype"),
             url(${MarlinSoftBasicWoff}) format("woff"),
             url(${MarlinSoftBasicWoff2}) format("woff2");
    }
    body {
        font-family: "Marlin Soft Basic";
        font-size: 20pt;
        color: #6a6970;
    }
`;

export default GlobalStyle;