import styled, { css } from "styled-components";
import { Colors } from "styles/theme";

export const Title = styled.h1`
  ${() => css`
    font-size: 2.4rem;
    font-weight: 700;
    align-self: flex-start;

    margin-bottom: 0.8rem;
  `}
`;

export const CodeEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 50rem;
  max-width: 60rem;
`;

export const CodeEditorHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 0 1.6rem;
  flex-direction: row;

  gap: 0.8rem;

  border-radius: 0.4rem 0.4rem 0 0;
  background-color: #ffffffda;

  height: 4rem;
`;

type CodeEditorHeaderDotsProps = {
  color: Colors;
};

export const CodeEditorHeaderDots = styled.div<CodeEditorHeaderDotsProps>`
  ${({ theme, color }) => css`
    width: 1rem;
    height: 1rem;

    border-radius: 50%;

    background-color: ${theme.colors[color]};
  `}
`;

export const Textarea = styled.textarea`
  ${({ theme }) => css`
    height: 35rem;

    font-family: ${theme.font.monospace};
    color: ${theme.colors.black};

    padding: 0.8rem 1.6rem;
    border: none;
    outline: none;

    border-radius: 0 0 0.4rem 0.4rem;

    resize: none;
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.6rem;

  align-self: flex-end;
  margin-top: 1.6rem;
`;

export const SubmitButton = styled.button`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 3rem;
    font-size: 1.6rem;
    line-height: 2.75rem;

    background-color: ${theme.colors.blue};
    color: white;

    border: none;
    outline: none;

    padding: 0 1.6rem;
    border-radius: 2.4rem;

    cursor: pointer;

    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  `}
`;

export const SendValue = styled(SubmitButton)`
  background-color: #ffffff1a;
  backdrop-filter: blur(10px);

  input {
    display: none;
  }
`;
