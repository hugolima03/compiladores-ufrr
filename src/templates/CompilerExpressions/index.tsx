import React, { useState } from "react";

import * as ReactD3TreeComponent from "react-d3-tree";

import CodeEditor from "components/CodeEditor";

import * as S from "./styles";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

import { ReactD3Tree, getReactD3Tree } from "./pipeline1/Tree";
import SimboloIdentificador from "./pipeline2/SimboloIdentificador";

import Pipeline1 from "./pipeline1";
import Pipeline2 from "./pipeline2";
import Pipeline3 from "./pipeline3";

import Instrucao from "./pipeline3/Instruction";
import { CustomError } from "./exception/ErroSemantico";
import { Warning } from "@styled-icons/entypo";
import { ErrorItem, ErrorsWrapper } from "components/CodeEditor/styles";
import { WeakPrecedenceParser } from "./pipeline1/WeakPrecedenceParser";
import { PascalGrammar } from "./pipeline1/PascalGrammar";

const CompilerExpressions = () => {
  const [weakPrecedenceParser, setWeakPrecedenceParser] = useState<WeakPrecedenceParser | null>(null);
  const [syntaxTree, setSyntaxTree] = useState<ReactD3Tree | null>(null);
  const [symbolTable, setSymbolTable] = useState<SimboloIdentificador[]>();
  const [nonOptimizedInstructions, setNonOptimizedInstructions] = useState<
    Instrucao[][] | null
  >(null);
  const [optimizedInstructions, setOptimizedInstructions] = useState<
    Instrucao[][] | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  function onSubmit(sourceCode: string) {
    try {
      const { syntaxTree, weakPrecedenceParser } = new Pipeline1(sourceCode).start();

      const { expressions, tabelaDeSimbolos } = new Pipeline2(
        syntaxTree!
      ).start();

      const { nonOptimizedInstructions, optimizedInstructions } = new Pipeline3(
        expressions
      ).start();


      // Hooks React para renderização
      const d3tree = getReactD3Tree(syntaxTree!);

      setSyntaxTree(d3tree);
      setSymbolTable(tabelaDeSimbolos);
      setWeakPrecedenceParser(weakPrecedenceParser);
      setNonOptimizedInstructions(
        nonOptimizedInstructions.filter((g) => Array.isArray(g))
      );
      setOptimizedInstructions(optimizedInstructions);
      setError(null);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    }
  }

  return (
    <S.Container>
      <CodeEditor
        title="CompilerExpressions"
        defaultValue={`VAR
  prova1: int;
  prova2: int;
  atividades: int;
BEGIN
  prova1 = 9;
  prova2 = 8;
  atividades = 10;
  return (prova1 + prova2 + atividades) / 3;
END.`}
        onSubmit={onSubmit}
      />

      {error ? (
        <ErrorsWrapper>
          <ErrorItem type="compilation">
            <Warning />
            <p>{error}</p>
          </ErrorItem>
        </ErrorsWrapper>
      ) : null}

      {weakPrecedenceParser && (
        <S.DRtableWrapper>
          <h2>Tabela de deslocamento e redução</h2>
          <Table>
            <thead>
              <TableRow>
                <TableHeader></TableHeader>
                {PascalGrammar._terminais.map((t) => (
                  <TableHeader key={t}>{t}</TableHeader>
                ))}
                <TableHeader>{weakPrecedenceParser._fdc}</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {Object.keys(weakPrecedenceParser._tabelaDR).map((line) => {
                return (
                  <TableRow key={line}>
                    <TableDatacell>{line}</TableDatacell>
                    {Object.keys(weakPrecedenceParser._tabelaDR![line]).map((r) => (
                      <TableDatacell key={r}>
                        {`${weakPrecedenceParser._tabelaDR![line][r] || '-'}`}
                      </TableDatacell>
                    ))}
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </S.DRtableWrapper>
      )}

      {syntaxTree && (
        <>
          <h2>Árvore sintática</h2>
          <S.TreeWrapper>
            <ReactD3TreeComponent.Tree
              orientation="vertical"
              data={syntaxTree}
              translate={{ x: 600, y: 40 }}
              collapsible={false}
            />
          </S.TreeWrapper>
        </>
      )}

      {symbolTable ? (
        <>
          <h2>Tabela de símbolos</h2>
          <Table style={{ margin: 0 }}>
            <thead>
              <TableRow>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Tipo</TableHeader>
                <TableHeader>Classe</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {symbolTable.map((symbol) => (
                <TableRow key={symbol._nome}>
                  <TableDatacell>{symbol._nome}</TableDatacell>
                  <TableDatacell>{symbol.tipo}</TableDatacell>
                  <TableDatacell>{symbol.token._classe}</TableDatacell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </>
      ) : null}

      {nonOptimizedInstructions ? (
        <>
          <h2>Instruções não otimizadas</h2>
          <Table style={{ margin: 0 }}>
            <thead>
              <TableRow>
                <TableHeader>Operador</TableHeader>
                <TableHeader>Operando</TableHeader>
                <TableHeader>Argumentos</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {nonOptimizedInstructions?.map((instructionList) =>
                instructionList?.map((instruction, index) => (
                  <TableRow key={`${instruction.operator}${index}`}>
                    <TableDatacell>{instruction.operator}</TableDatacell>
                    <TableDatacell>{instruction.operand}</TableDatacell>
                    <TableDatacell>{instruction.args.toString()}</TableDatacell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </>
      ) : null}

      {optimizedInstructions ? (
        <>
          <h2>Instruções otimizadas</h2>
          <Table style={{ margin: 0 }}>
            <thead>
              <TableRow>
                <TableHeader>Operador</TableHeader>
                <TableHeader>Operando</TableHeader>
                <TableHeader>Argumentos</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {optimizedInstructions?.map((instructionList) =>
                instructionList?.map((instruction, index) => (
                  <TableRow key={`${instruction.operator}${index}`}>
                    <TableDatacell>{instruction.operator}</TableDatacell>
                    <TableDatacell>{instruction.operand}</TableDatacell>
                    <TableDatacell>{instruction.args.toString()}</TableDatacell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </>
      ) : null}
    </S.Container>
  );
};

export default CompilerExpressions;
