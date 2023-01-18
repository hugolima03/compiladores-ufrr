import React, { useState } from "react";

import * as S from "./styles";

type CodeEditorProps = {
  onSubmit: (value: string) => void;
};

const CodeEditor = ({ onSubmit }: CodeEditorProps) => {
  const [value, setValue] = useState("");

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
      };
      reader.onerror = (err) => {
        window.alert(`Falha ao carregar arquivo ${err}`);
      };
    }
  }

  return (
    <S.CodeEditorWrapper>
      <S.CodeEditorHeader>
        <S.CodeEditorHeaderDots color="red" />
        <S.CodeEditorHeaderDots color="green" />
        <S.CodeEditorHeaderDots color="yellow" />
      </S.CodeEditorHeader>
      <S.Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
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
    </S.CodeEditorWrapper>
  );
};

export default CodeEditor;
