import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;

  width: 100vw;
  padding: 25vh 0;
  /* margin: 25vh auto; */

  gap: 1.6rem;

  h2 {
    font-size: 1.8rem;
  }
`

export const TreeWrapper = styled.div`

  background-color: white;
  border-radius: 0.4rem;

  width: 100vw;
  height: 60rem;
`