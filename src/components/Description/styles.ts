import styled, { css } from "styled-components";

export const Container = styled.div`
  ${() => css`
    overflow: auto;
    max-width: 50rem;
    max-height: 40rem;
    padding-right: 1.6rem;

    h1,
    h2,
    h3 {
      line-height: 150%;

      & + p {
        margin-bottom: 0.8rem;
      }
    }

    h1 {
      font-size: 3.2rem;
    }
    h2 {
      font-size: 2.4rem;
    }
    h3 {
      font-size: 1.8rem;
    }

    em {
      font-family: "Playfair Display";
      font-weight: 400;
    }
  `}
`;
