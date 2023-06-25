import { getReactD3Tree } from "./sintatico/Tree";

import Semantico from "./semantico/Semantico.mjs";

import Intermediario from "./sintese/Intermediario.mjs";

import Mips from "./sintese/Mips.mjs";

import Pipeline1 from "./pipelines/Pipeline1";

describe('CompilerExpressions', () => {
  it('Generic test', () => {
    const sourceCode = `variaveis
    var: int;
    hugo: int;
inicio
    var = 0;
    hugo = 10;
    retorne var + hugo;
fim`

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

    expect(arvoreSintatica).toMatchSnapshot()
    expect(semantico).toMatchSnapshot()
    expect(arvoresDeExpressoes).toMatchSnapshot()
    expect(tabelaDeSimbolos).toMatchSnapshot()
    expect(intermediario).toMatchSnapshot()
    expect(gerados).toMatchSnapshot()
    expect(optimizados).toMatchSnapshot()
    expect(mips).toMatchSnapshot()
    expect(d3tree).toMatchSnapshot()
  })
})