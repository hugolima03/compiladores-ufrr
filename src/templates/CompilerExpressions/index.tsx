import React, { useRef, useState } from "react";

import Tree from "react-d3-tree";

import CodeEditor from "components/CodeEditor";

import Sintatico from "./sintatico/Sintatico.mjs";
import Semantico from "./semantico/Semantico.mjs";
import Intermediario from "./sintese/Intermediario.mjs";

import Mips from "./Ed/sintese/Mips.mjs";

import * as S from "./styles";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";
import Arvore, { ReactD3Tree, getReactD3Tree } from "./sintatico/Arvore";
import SimboloIdentificador from "./semantico/SimboloIdentificador.mjs";

const CompilerExpressions = () => {
  const tree = useRef<HTMLDivElement>(null);
  const [syntaxTree, setSyntaxTree] = useState<ReactD3Tree | null>(null);
  const [expressionsTrees, setExpressionsTrees] = useState<Arvore[] | null>(
    null
  );
  const [symbolTable, setSymbolTable] = useState<SimboloIdentificador[]>();

  function onSubmit(sourceCode: string) {
    const sintatico = new Sintatico();
    let arvoreSintatica = sintatico.parsear(sourceCode);

    const semantico = new Semantico(arvoreSintatica!);
    const arvoresDeExpressoes = semantico.validarComandos();
    const tabelaDeSimbolos = semantico.tabelaDeSimbolos;

    // const intermediario = new Intermediario(arvoresDeExpressoes);
    // const gerados = intermediario.comandos;
    // const optimizados = intermediario.optimizar();

    // const mips = new Mips(tabelaDeSimbolos);
    // for (let i = 0; i < intermediario.totalComandos; ++i) {
    //   gerados.push({
    //     gerado: gerados[i],
    //     otimizado: optimizados[i],
    //     linha: arvoresDeExpressoes[i].extra.linha,
    //   } as any);

    //   mips.adicionarInstrucoes(optimizados[i]);
    // }

    const d3tree = getReactD3Tree(arvoreSintatica!);
    setSyntaxTree(d3tree);
    setSymbolTable(tabelaDeSimbolos);
    setExpressionsTrees(arvoresDeExpressoes);

    tree.current?.scrollIntoView();
    // console.log(sintatico);
    // console.log(arvoreSintatica);
    // console.log(semantico);
    console.log(arvoresDeExpressoes);
    // console.log(tabelaDeSimbolos);
    // console.log(intermediario);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips);
    // console.log(gerados);
    // console.log(optimizados);
    // console.log(mips)
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
          <Tree
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
              <Tree
                orientation="vertical"
                data={tree}
                translate={{ x: 600, y: 40 }}
                collapsible={false}
              />
            )}
          </S.TreeWrapper>
        ))}
    </S.Container>
  );
};

export default CompilerExpressions;
