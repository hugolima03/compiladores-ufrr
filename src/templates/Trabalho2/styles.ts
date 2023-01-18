import styled, { css } from "styled-components";

export const Container = styled.main`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: fit-content;
  height: 100vh;

  margin: 0 auto;
`;

export const Title = styled.h1`
  ${() => css`
    font-size: 2.4rem;
    font-weight: 700;
    align-self: flex-start;

    margin-bottom: 0.8rem;
  `}
`;
