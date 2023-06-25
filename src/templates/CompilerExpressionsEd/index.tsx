import React, { useRef, useState } from "react";

import CodeEditor from "components/CodeEditor";

import Sintatico from "./Ed/sintatico/Sintatico.mjs";
import Semantico from "./Ed/semantico/Semantico.mjs";
import Intermediario from "./Ed/sintese/Intermediario.mjs";

import Mips from "./Ed/sintese/Mips.mjs";

import * as S from "./styles";

const CompilerExpressions = () => {
  function onSubmit(sourceCode: string) {
    const sintatico = new Sintatico();
    let arvoreSintatica = sintatico.parsear(sourceCode);

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
        linha: arvoresDeExpressoes[i].extra.linha,
      } as any);

      mips.adicionarInstrucoes(optimizados[i]);
    }

    
    console.log(sintatico);
    console.log(arvoreSintatica);
    console.log(semantico);
    console.log(arvoresDeExpressoes);
    console.log(tabelaDeSimbolos);
    // console.log(intermediario);
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
    </S.Container>
  );
};

export default CompilerExpressions;
