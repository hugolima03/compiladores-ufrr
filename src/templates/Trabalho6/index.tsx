import React, { useEffect, useRef, useState } from "react";

import Grammar from "templates/Trabalho5/Grammar";
import { Container, TreeWrapper } from "templates/Trabalho5/styles";

import CodeEditor from "components/CodeEditor";

import PrecedenciaFraca from "./PrecedenciaFraca";
import SyntaxTree from "templates/Trabalho5/SyntaxTree";
import Tree from "react-d3-tree";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

const Trabalho6Template = () => {
  const tree = useRef<HTMLDivElement>(null);

  const [grammar, setGrammar] = useState<Grammar>();
  const [arvore, setArvore] = useState<SyntaxTree | null>(null);
  const [analisadorPF, setAnalisadorPF] = useState<PrecedenciaFraca>();

  function onSubmit(sourceCode: string) {
    if (analisadorPF && grammar) {
      const prods = analisadorPF.analisar(sourceCode);
      const arvore = SyntaxTree._parseProductionsRight(prods, grammar);
      setArvore(arvore);
      tree.current?.scrollIntoView();
    }
  }

  useEffect(() => {
    const weakPrecedenceGrammar = Grammar.createGrammar(
      {
        E: ["E+M", "M"],
        M: ["MxP", "P"],
        P: ["(E)", "v"],
      },
      "ε"
    );

    setGrammar(weakPrecedenceGrammar);

    const analisadorPF = PrecedenciaFraca.criar(
      weakPrecedenceGrammar,
      "E",
      "$"
    );
    setAnalisadorPF(analisadorPF);
    const prods = analisadorPF.analisar("v+vxv");
    const arvore = SyntaxTree._parseProductionsRight(
      prods,
      weakPrecedenceGrammar
    );
    setArvore(arvore);
  }, []);

  return (
    <>
      <Container>
        <CodeEditor
          title="Analisador Sintático de Precedência Fraca"
          placeholder="v+v"
          onSubmit={onSubmit}
        />

        {analisadorPF?._tabelaDR ? (
          <Table>
            <thead>
              <TableRow>
                <TableHeader></TableHeader>
                {analisadorPF._gramatica?.terminals.map((t) => (
                  <TableHeader key={t}>{t}</TableHeader>
                ))}
                <TableHeader>{analisadorPF._fdc}</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {Object.keys(analisadorPF._tabelaDR).map((line) => {
                return (
                  <TableRow key={line}>
                    <TableDatacell>{line}</TableDatacell>
                    {Object.keys(analisadorPF._tabelaDR![line]).map((r) => (
                      <TableDatacell key={r}>
                        {`${analisadorPF._tabelaDR![line][r]}`}
                      </TableDatacell>
                    ))}
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        ) : null}
      </Container>

      <TreeWrapper ref={tree}>
        {arvore && (
          <Tree
            orientation="vertical"
            data={arvore}
            translate={{ x: 600, y: 40 }}
            collapsible={false}
          />
        )}
      </TreeWrapper>
    </>
  );
};

export default Trabalho6Template;
