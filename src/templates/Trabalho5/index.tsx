/* eslint-disable react/no-unescaped-entities */
import React from "react";

import CodeEditor from "components/CodeEditor";

import ArvoreSintatica from './ArvoreSintatica'
import Gramatica from './Gramatica'
import LL1 from './LL1'

import * as S from "./styles";

const Trabalho5Template = () => {
  function onsubmit(sourceCode: string) {
    const gramaticaLL1 = Gramatica.criar({
      'E': ['MF'],
      'F': ['+MF', 'ε'], //E'
      'M': ['PN'],
      'N': ['xPN', 'ε'], //M'
      'P': ['(E)', 'v']
    },
      'ε'
    );

    const analisadorLL1 = LL1.criar(gramaticaLL1, 'E', '$');
    const prods = analisadorLL1.analisar(sourceCode || '(v+v)xv');
    const arvore = ArvoreSintatica.parsearProducoes(prods, gramaticaLL1, 'r');

    console.log(gramaticaLL1)
    console.log(analisadorLL1)
    console.log(prods)
    console.log(arvore._nos)
  }

  return (
    <S.Container>
      <CodeEditor
        title="Analisador Sintático Preditivo"
        placeholder="placeholder"
        onSubmit={onsubmit}
      />
    </S.Container>
  );
};

export default Trabalho5Template;
