import React, { useRef, useState } from "react";

import { Warning, InfoWithCircle } from "@styled-icons/entypo";

import * as S from "./styles";

type CodeEditorProps = {
  title?: string;
  onSubmit: (value: string) => void;
  errors?: Error[];
  placeholder?: string;
  defaultValue?: string;
};

export type Error = {
  type: "warning" | "compilation";
  message: string;
};

const CodeEditor = ({
  title,
  onSubmit,
  errors,
  placeholder,
  defaultValue = "",
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);

  function onClick() {
    onSubmit(value);
  }

  function onSubmitFile(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const file = e.target.files[0];
      reader.readAsText(file, "UTF-8");
      reader.onload = (suc) => {
        setValue(String(suc.target?.result));
        onSubmit(String(suc.target?.result));
      };
      reader.onerror = (err) => {
        window.alert(`Falha ao carregar arquivo ${err}`);
      };
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { current } = textareaRef;
    if (e.key === "Tab" && current) {
      e.preventDefault();
      const start = current.selectionStart;
      const end = current.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      current.value =
        current.value.substring(0, start) + "  " + current.value.substring(end);

      // put caret at right position again
      current.selectionStart = current.selectionEnd = start + 1;
    }
  };

  return (
    <S.CodeEditorWrapper>
      {title && <S.Title>{title}</S.Title>}
      <S.CodeEditorHeader>
        <S.CodeEditorHeaderDots color="red" />
        <S.CodeEditorHeaderDots color="green" />
        <S.CodeEditorHeaderDots color="yellow" />
      </S.CodeEditorHeader>
      <S.Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />

      <S.ButtonsWrapper>
        <S.SendValue as="label">
          Enviar arquivo
          <input
            type="file"
            onChange={onSubmitFile}
            accept=".txt"
            multiple={false}
          />
        </S.SendValue>
        <S.SubmitButton type="button" onClick={onClick}>
          Compilar
        </S.SubmitButton>
      </S.ButtonsWrapper>

      {!!errors?.length && (
        <S.ErrorsWrapper>
          {errors.map(({ message, type }, index) => (
            <S.ErrorItem key={message + index} type={type}>
              {type === "warning" && <InfoWithCircle />}
              {type === "compilation" && <Warning />}
              <p>{message}</p>
            </S.ErrorItem>
          ))}
        </S.ErrorsWrapper>
      )}
    </S.CodeEditorWrapper>
  );
};

export default CodeEditor;
