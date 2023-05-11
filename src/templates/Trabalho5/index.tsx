/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";

import CodeEditor from "components/CodeEditor";
import {
  Table,
  TableDatacell,
  TableHeader,
  TableRow,
} from "components/Table/styles";

import ArvoreSintatica from "./ArvoreSintatica";
import Gramatica from "./Gramatica";
import LL1 from "./LL1";

import * as S from "./styles";
import Tree from "react-d3-tree";

const orgChart = {
  name: "CEO",
  children: [
    {
      name: "Manager",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};

const Trabalho5Template = () => {
  const [arvore, setArvore] = useState<ArvoreSintatica>();
  const [gramaticaLL1, setGramaticaLL1] = useState<Gramatica>();
  const [analisadorLL1, setAnalisadorLL1] = useState<LL1>();
  function onsubmit(sourceCode: string) {
    console.log(sourceCode);
  }

  useEffect(() => {
    const gramaticaLL1 = Gramatica.criar(
      {
        E: ["MF"],
        F: ["+MF", "ε"], //E'
        M: ["PN"],
        N: ["xPN", "ε"], //M'
        P: ["(E)", "v"],
      },
      "ε"
    );
    setGramaticaLL1(gramaticaLL1);
    const analisadorLL1 = LL1.criar(gramaticaLL1, "E", "$");
    setAnalisadorLL1(analisadorLL1);
    const prods = analisadorLL1.analisar("(v+v)xv");
    const arvore = ArvoreSintatica.parsearProducoes(prods, gramaticaLL1, "r");
    setArvore(arvore);
  }, []);

  return (
    <S.Container>
      <S.Row>
        <CodeEditor
          title="Analisador Sintático Preditivo"
          placeholder="placeholder"
          onSubmit={onsubmit}
        />
        <Table>
          <thead>
            <TableRow>
              {gramaticaLL1?._terminais.map((n) => (
                <TableHeader key={n}>{n}</TableHeader>
              ))}
              <TableHeader>$</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {analisadorLL1 &&
              Object.keys(analisadorLL1._tabela).map((snt) => (
                <TableRow key={snt}>
                  <TableDatacell>{snt}</TableDatacell>
                  {Object.keys(analisadorLL1._tabela[snt]).map(
                    (st: any, index: number) => (
                      <TableDatacell key={index}>
                        {analisadorLL1._tabela[snt][st] !== null ? `P` : "-"}
                      </TableDatacell>
                    )
                  )}
                </TableRow>
              ))}
            {/* <TableRow>
              {analisadorLL1?._tabela.map((row) => {
                return <TableDatacell>{row}</TableDatacell>
              })}
            </TableRow> */}
          </tbody>
        </Table>
      </S.Row>

      <S.TreeWrapper>
        <Tree orientation="vertical" data={orgChart} />
      </S.TreeWrapper>
    </S.Container>
  );
};

export default Trabalho5Template;
