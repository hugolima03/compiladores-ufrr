import React, { useRef, useState } from "react";

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

const CompilerExpressions = () => {
  const tree = useRef<HTMLDivElement>(null);
  const [syntaxTree, setSyntaxTree] = useState<ReactD3Tree | null>(null);
  const [symbolTable, setSymbolTable] = useState<SimboloIdentificador[]>();
  const [nonOptimizedInstructions, setNonOptimizedInstructions] = useState<
    Instrucao[][] | null
  >(null);
  const [optimizedInstructions, setOptimizedInstructions] = useState<
    Instrucao[][] | null
  >(null);

  function onSubmit(sourceCode: string) {
    const syntaxTree = new Pipeline1(sourceCode).start();

    const { expressions, tabelaDeSimbolos } = new Pipeline2(
      syntaxTree!
    ).start();

    const { nonOptimizedInstructions, optimizedInstructions } = new Pipeline3(
      expressions
    ).start();

    
    // console.log(sintatico);
    // console.log(arvoreSintatica);
    // console.log(semantico);
    // console.log(expressions);
    // console.log(tabelaDeSimbolos);
    // console.log(intermediario);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips);
    const d3tree = getReactD3Tree(syntaxTree!);
    setSyntaxTree(d3tree);
    setSymbolTable(tabelaDeSimbolos);
    setNonOptimizedInstructions(
      nonOptimizedInstructions.filter((g) => Array.isArray(g))
    );
    setOptimizedInstructions(optimizedInstructions);
    tree.current?.scrollIntoView();
  }

  return (
    <S.Container>
      <CodeEditor
        title="CompilerExpressions"
        defaultValue={`VAR
    var: int;
    hugo: int;
BEGIN
    var = 0;
    hugo = 10;
    return var + hugo;
END.`}
        onSubmit={onSubmit}
      />

      <h2>Árvore sintática</h2>

      <S.TreeWrapper ref={tree}>
        {syntaxTree && (
          <ReactD3TreeComponent.Tree
            orientation="vertical"
            data={syntaxTree}
            translate={{ x: 600, y: 40 }}
            collapsible={false}
          />
        )}
      </S.TreeWrapper>

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
