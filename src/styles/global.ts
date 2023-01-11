import { css, createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    scroll-behavior: smooth;
  }

  ${() => css`
    html {
      font-size: 62.5%;
    }

    a {
      text-decoration: none;
    }
  `}  
`;

export default GlobalStyles;
