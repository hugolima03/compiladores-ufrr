import React from "react";
import Base from "templates/Base";

import CodeEditor from "components/CodeEditor";
import Description from "components/Description";

import * as S from "./styles";

const Trabalho3Template = () => {
  return (
    <S.Container>
      <CodeEditor
        title="Analisador Léxico"
        onSubmit={() => console.log("1231231k")}
      />

      <Description>
        <h1>Linguagens Regulares</h1>
        <p>
          <em>A</em> - Inicia com uma quantidade n de ocorrências do elemento 0
          e termina com a mesma quantidade n de ocorrências do elemento 0.
        </p>

        <p>
          <em>B</em> - Inicia com uma letra ou sublinhado (regra de nomeação de
          variáveis).
        </p>

        <p>
          <em>C</em> - Sequência de números naturais sem zeros à esquerda.
        </p>

        <p>
          <em>D</em> - Sequência de números separados pelo operador aritmético de soma.
        </p>
      </Description>
    </S.Container>
  );
};

export default Trabalho3Template;
