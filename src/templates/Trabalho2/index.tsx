import React, { useState } from "react";

import CodeEditor from "components/CodeEditor";

import { tokenizer } from "functions/tokenizer/index";

import * as S from "./styles";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

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
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Lexema</TableHeader>
              <TableHeader>Rótulo</TableHeader>
              <TableHeader>Código</TableHeader>
            </TableRow>
          </thead>

          <tbody>
            {lexemes?.map((l, index) => {
              return (
                <TableRow key={index + l.label}>
                  <TableDatacell>{l.lexeme}</TableDatacell>
                  <TableDatacell>{l.label}</TableDatacell>
                  <TableDatacell>{index + 1}</TableDatacell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      )}
    </S.Container>
  );
};

export default Trabalho2Template;
