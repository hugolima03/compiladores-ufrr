import React from "react";

import CodeEditor from "components/CodeEditor";

import { tokenizer } from "functions/tokenizer/index";

import * as S from "./styles";

type Lexeme = {
  value: string;
  label: string;
  code: number;
};

const Trabalho2Template = () => {
  function onSubmit(sourceCode: string) {
    const lines = sourceCode.split("\n");
    const lexemes = [];

    for (let i in lines) {
      lexemes.push(tokenizer(lines[i]));
    }

    console.log(lexemes);
  }

  return (
    <S.Container>
      <CodeEditor title="Analisador de Lexemas" onSubmit={onSubmit} />

      <S.Table>
        <thead>
          <S.TableRow>
            <S.TableHeader>Lexema</S.TableHeader>
            <S.TableHeader>Rótulo</S.TableHeader>
            <S.TableHeader>Código</S.TableHeader>
          </S.TableRow>
        </thead>

        <tbody>
          <S.TableRow>
            <S.TableDatacell>x</S.TableDatacell>
            <S.TableDatacell>ID</S.TableDatacell>
            <S.TableDatacell>1</S.TableDatacell>
          </S.TableRow>
          <S.TableRow>
            <S.TableDatacell>=</S.TableDatacell>
            <S.TableDatacell>=</S.TableDatacell>
            <S.TableDatacell>2</S.TableDatacell>
          </S.TableRow>
        </tbody>
      </S.Table>
    </S.Container>
  );
};

export default Trabalho2Template;
