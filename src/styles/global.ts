import { css, createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    ${({ theme }) => css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        scroll-behavior: smooth;

        font-size: ${theme.font.sizes.medium};
        font-family: ${theme.font.family};
      }

      html {
        font-size: 62.5%;
      }

      body {
        background-color: ${theme.colors.primary};
      }

      a {
        text-decoration: none;
      }
    `}  
`;

export default GlobalStyles;
