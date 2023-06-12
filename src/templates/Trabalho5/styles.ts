import styled from "styled-components";

export const Container = styled.main`
  display: flex;
  flex-direction: column;

  gap: 2.4rem;
  padding: 10% 4.2rem 10% 4.2rem;

  max-width: 102.4rem;
  margin: 0 auto;

  table {
    height: fit-content;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;

  flex-direction: row;
  gap: 2.4rem;
`

export const TreeWrapper = styled.div`
  height: 90vh;
  background-color: white;
  border-radius: 0.4rem;
`