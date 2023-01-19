import React, { useState } from "react";

import CodeEditor from "components/CodeEditor";

import { tokenizer } from "functions/tokenizer/index";

import * as S from "./styles";

type Lexeme = {
  lexeme: string;
  label: string;
  code: number;
};

const Trabalho2Template = () => {
  const [lexemes, setLexemes] = useState<Lexeme[] | null>(null);

  function onSubmit(sourceCode: string) {
    const lines = sourceCode.split("\n");
    let tempLexemes: Lexeme[] = [];

    for (let i in lines) {
      const lexemes = tokenizer(lines[i]);
      tempLexemes = [...tempLexemes, ...lexemes] as Lexeme[];
    }

    setLexemes(tempLexemes);
  }

  return (
    <S.Container>
      <CodeEditor title="Analisador de Lexemas" onSubmit={onSubmit} />

      {!!lexemes?.length && (
        <S.Table>
          <thead>
            <S.TableRow>
              <S.TableHeader>Lexema</S.TableHeader>
              <S.TableHeader>Rótulo</S.TableHeader>
              <S.TableHeader>Código</S.TableHeader>
            </S.TableRow>
          </thead>

          <tbody>
            {lexemes?.map((l, index) => {
              return (
                <S.TableRow key={index + l.label}>
                  <S.TableDatacell>{l.lexeme}</S.TableDatacell>
                  <S.TableDatacell>{l.label}</S.TableDatacell>
                  <S.TableDatacell>{index + 1}</S.TableDatacell>
                </S.TableRow>
              );
            })}
          </tbody>
        </S.Table>
      )}
    </S.Container>
  );
};

export default Trabalho2Template;
