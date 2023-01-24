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

        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.1);
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(100, 100, 100, 0.8);
        }
        &::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 100, 1);
        }
      }

      html {
        font-size: 62.5%;
      }

      body {
        width: 100vw;
        height: 100vh;
        background: ${theme.gradients.primary};
      }

      a {
        text-decoration: none;
      }

      p,
      h1,
      h2,
      h3 {
        color: white;
      }

      strong,
      h1,
      h2,
      h3 {
        font-weight: 700;
      }

      h1 {
        font-size: ${theme.font.sizes.xxxlarge};
      }
    `}  
`;

export default GlobalStyles;
