/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";

import CodeEditor, { Error } from "components/CodeEditor";
import Description from "components/Description";

import * as S from "./styles";

import { useLexicalAnalyser, Token } from "functions/automaton";

import { automatons } from "./automatons";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

const Trabalho3Template = () => {
  const { checkSourceCode } = useLexicalAnalyser(automatons);

  const [errors, setErrors] = useState<Error[]>([]);
  const [tokens, setTokens] = useState<Token[] | null>(null);

  function onsubmit(sourceCode: string) {
    const { errors, data } = checkSourceCode(sourceCode);
    setTokens(data);
    setErrors(errors);
  }

  return (
    <S.Container>
      <CodeEditor
        title="Analisador Léxico"
        onSubmit={onsubmit}
        errors={errors}
      />

      {!!tokens?.length && (
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Token</TableHeader>
              <TableHeader>Linguagem</TableHeader>
            </TableRow>
          </thead>

          <tbody>
            {tokens?.map(({ language, token }, index) => {
              return (
                <TableRow key={index + language}>
                  <TableDatacell>{token}</TableDatacell>
                  <TableDatacell>{language}</TableDatacell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      )}

      {tokens?.length === 0 && (
        <Description>
          <h1>Nenhuma linguagem foi identificada⚠️.</h1>
          <p>
            Tente separar as sentenças por espaço ou utilizando quebra de linhas.
          </p>
        </Description>
      )}

      {tokens === null && (
        <Description>
          <h1>Linguagens Regulares</h1>
          <p>
            <em>A</em> - Cadeias formadas por um número arbitrário de repetições
            de 1 a 3 a's seguidos pelo mesmo número de b's. Ex: (ab, aabb, abab,
            aaabbb).
          </p>

          <p>
            <em>B</em> - Cadeia formada pelas letras a, b, c, d que terminam com
            a.
          </p>

          <p>
            <em>C</em> - Sequência de números naturais sem zeros à esquerda.
          </p>

          <p>
            <em>D</em> - Cadeias do alfabeto "x" e "y" que começam e terminam com x ou que começam e terminam com y.
          </p>
        </Description>
      )}
    </S.Container>
  );
};

export default Trabalho3Template;
