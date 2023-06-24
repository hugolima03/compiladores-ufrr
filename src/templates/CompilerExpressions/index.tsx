import React, { useRef, useState } from "react";

import Tree from "react-d3-tree";

import CodeEditor from "components/CodeEditor";

import Mips from "./Ed/sintese/Mips.mjs";
import Sintatico from "./Ed/sintatico/Sintatico.mjs";
import Semantico from "./Ed/semantico/Semantico.mjs";
import Intermediario from "./Ed/sintese/Intermediario.mjs";

import SyntaxTree from "templates/Trabalho5/SyntaxTree";
import * as S from "./styles";

const CompilerExpressions = () => {
  const tree = useRef<HTMLDivElement>(null);
  const [arvore, setArvore] = useState<SyntaxTree | null>(null);

  function onSubmit(sourceCode: string) {
    const sintatico = new Sintatico();
    let arvoreSintatica = sintatico.parsear(sourceCode);

    const semantico = new Semantico(arvoreSintatica);
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
        linha: arvoresDeExpressoes[i].extra.linha,
      } as any);

      mips.adicionarInstrucoes(optimizados[i]);
    }

    // console.log(sintatico)
    // setArvore(arvoreSintatica);
    console.log(arvoreSintatica);
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
inicio
    var = 0;
    retorne var;
fim`}
        onSubmit={onSubmit}
      />

      <h1>Árvore sintática</h1>

      <S.TreeWrapper ref={tree}>
        {arvore && (
          <Tree
            orientation="vertical"
            data={arvore}
            translate={{ x: 600, y: 40 }}
            collapsible={false}
          />
        )}
      </S.TreeWrapper>
    </S.Container>
  );
};

export default CompilerExpressions;
