import React, { useRef, useState } from "react";

import * as ReactD3TreeComponent from "react-d3-tree";

import CodeEditor from "components/CodeEditor";

import Pipeline1 from "./pipelines/Pipeline1";
import Semantico from "./semantico/Semantico.mjs";
import Intermediario from "./sintese/Intermediario.mjs";

import Mips from "./sintese/Mips.mjs";

import * as S from "./styles";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";
import { Tree, ReactD3Tree, getReactD3Tree } from "./sintatico/Tree";
import SimboloIdentificador from "./semantico/SimboloIdentificador.mjs";

const CompilerExpressions = () => {
  const tree = useRef<HTMLDivElement>(null);
  const [syntaxTree, setSyntaxTree] = useState<ReactD3Tree | null>(null);
  const [expressionsTrees, setExpressionsTrees] = useState<Tree[] | null>(null);
  const [symbolTable, setSymbolTable] = useState<SimboloIdentificador[]>();
  const [mipsCode, setMipsCode] = useState<Mips | null>(null);

  function onSubmit(sourceCode: string) {
    const arvoreSintatica = new Pipeline1(sourceCode).start();

    const semantico = new Semantico(arvoreSintatica!);
    const arvoresDeExpressoes = semantico.validarComandos();
    const tabelaDeSimbolos = semantico.tabelaDeSimbolos;

    const intermediario = new Intermediario(arvoresDeExpressoes);
    const gerados = intermediario.comandos;
    const optimizados = intermediario.optimizar();

    const mips = new Mips(tabelaDeSimbolos);
    for (let i = 0; i < intermediario.totalComandos; ++i) {
      gerados.push({
        gerado: gerados[i],
        otimizado: optimizados[i],
        linha: arvoresDeExpressoes[i].extra!.linha,
      } as any);

      mips.adicionarInstrucoes(optimizados[i]);
    }

    const d3tree = getReactD3Tree(arvoreSintatica!);
    setSyntaxTree(d3tree);
    setSymbolTable(tabelaDeSimbolos);
    setExpressionsTrees(arvoresDeExpressoes);
    setMipsCode(mips);

    tree.current?.scrollIntoView();
    // console.log(sintatico);
    // console.log(arvoreSintatica);
    // console.log(semantico);
    // console.log(arvoresDeExpressoes);
    // console.log(tabelaDeSimbolos);
    // console.log(intermediario);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips);
  }

  return (
    <S.Container>
      <CodeEditor
        title="CompilerExpressions"
        defaultValue={`variaveis
    var: int;
    hugo: int;
inicio
    var = 0;
    hugo = 10;
    retorne var + hugo;
fim`}
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

      {expressionsTrees ? <h2>Árvores de expressões</h2> : null}
      {expressionsTrees
        ?.map((tree) => getReactD3Tree(tree))
        ?.map((tree, index) => (
          <S.TreeWrapper
            key={`${tree.name}${index}`}
            style={{ height: "30rem" }}
          >
            {tree && (
              <ReactD3TreeComponent.Tree
                orientation="vertical"
                data={tree}
                translate={{ x: 600, y: 40 }}
                collapsible={false}
              />
            )}
          </S.TreeWrapper>
        ))}

      {mipsCode ? (
        <>
          <h2>Variaveis</h2>
          <Table style={{ margin: 0 }}>
            <thead>
              <TableRow>
                <TableHeader>Variável</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {mipsCode._tabeladeVariaveis.map(
                (instrucao: any, index: number) => (
                  <TableRow key={`${instrucao._nome}${index}`}>
                    <TableDatacell>{`${instrucao._nome}${instrucao._nome}`}</TableDatacell>
                  </TableRow>
                )
              )}
            </tbody>
          </Table>

          <h2>Instruções geradas</h2>
          <Table style={{ margin: 0 }}>
            <thead>
              <TableRow>
                <TableHeader>Operador</TableHeader>
                <TableHeader>Operando</TableHeader>
                <TableHeader>Argumentos</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {mipsCode._texto.map((instrucao, index) => (
                <TableRow key={`${instrucao._operador}${index}`}>
                  <TableDatacell>{instrucao._operador}</TableDatacell>
                  <TableDatacell>{instrucao._operando}</TableDatacell>
                  <TableDatacell>
                    {Array(instrucao._argumentos).toString()}
                  </TableDatacell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </>
      ) : null}
    </S.Container>
  );
};

export default CompilerExpressions;
