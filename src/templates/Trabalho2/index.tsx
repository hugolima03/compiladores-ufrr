import React from "react";

import TextEditor from "components/TextEditor";

import * as S from "./styles";

const Trabalho2Template = () => {
  return (
    <S.Container>
      <S.Title>Analisador de Lexemas</S.Title>
      <TextEditor onSubmit={(v) => console.log(v)} />
    </S.Container>
  );
};

export default Trabalho2Template;
