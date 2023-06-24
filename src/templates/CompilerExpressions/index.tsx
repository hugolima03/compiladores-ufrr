import React, { useRef, useState } from "react";

import Tree from "react-d3-tree";

import CodeEditor from "components/CodeEditor";

import Arvore from "./Ed/sintatico/Arvore";
import SimboloIdentificador from "./Ed/semantico/SimboloIdentificador";

import Sintatico from "./Ed/sintatico/Sintatico";
import Semantico from "./Ed/semantico/Semantico";

import Mips from "./Ed/sintese/Mips.mjs";
import Intermediario from "./Ed/sintese/Intermediario.mjs";

import * as S from "./styles";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

const CompilerExpressions = () => {
  const tree = useRef<HTMLDivElement>(null);
  const [syntaxTree, setSyntaxTree] = useState<Arvore | null>(null);
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

    setSymbolTable(tabelaDeSimbolos);
    setSyntaxTree(arvoreSintatica);
    setExpressionsTrees(arvoresDeExpressoes);
    tree.current?.scrollIntoView();

    // console.log(semantico)
    // console.log(arvoresDeExpressoes)
    // console.log(tabelaDeSimbolos)
    // console.log(intermediario)
    // console.log(gerados)
    // console.log(optimizados)
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
      {expressionsTrees?.map((tree, index) => (
        <S.TreeWrapper key={`${tree.name}${index}`} style={{ height: "30rem" }}>
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
