import Mips from "./sintese/Mips.mjs";
import { getReactD3Tree } from "./pipeline1/Tree";

import Pipeline1 from "./pipeline1";
import Pipeline2 from "./pipeline2";
import Pipeline3 from "./pipeline3";

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

    const { expressions, tabelaDeSimbolos } = new Pipeline2(
      arvoreSintatica!
    ).start();

    const { gerados, intermediario, optimizados } = new Pipeline3(expressions).start()

    const mips = new Mips(tabelaDeSimbolos);
    for (let i = 0; i < intermediario.totalComandos; ++i) {
      gerados.push({
        gerado: gerados[i],
        otimizado: optimizados[i],
        linha: expressions[i].extra!.linha,
      } as any);

      mips.adicionarInstrucoes(optimizados[i]);
    }

    const d3tree = getReactD3Tree(arvoreSintatica!);

    expect(arvoreSintatica).toMatchSnapshot()
    expect(expressions).toMatchSnapshot()
    expect(tabelaDeSimbolos).toMatchSnapshot()
    expect(intermediario).toMatchSnapshot()
    expect(gerados).toMatchSnapshot()
    expect(optimizados).toMatchSnapshot()
    expect(mips).toMatchSnapshot()
    expect(d3tree).toMatchSnapshot()
  })
})