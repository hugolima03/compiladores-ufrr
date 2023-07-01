import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;

  width: 100%;
  padding: 0 2.4rem;
  padding-top: 25vh;
  padding-bottom: 2.4rem;
  /* margin: 25vh auto; */

  gap: 1.6rem;

  h2 {
    font-size: 1.8rem;
  }
`;

export const TreeWrapper = styled.div`
  background-color: white;
  border-radius: 0.4rem;

  width: 100%;
  height: 60rem;
`;

export const DRtableWrapper = styled.div`
  width: 100%;

  table {
    width: 100%;
  }

  td,
  th {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;
