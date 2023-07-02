import { getReactD3Tree } from "./pipeline1/Tree";

import Pipeline1 from "./pipeline1";
import Pipeline2 from "./pipeline2";
import Pipeline3 from "./pipeline3";

describe('CompilerExpressions', () => {
  it('Generic test', () => {
    const sourceCode = `VAR
    var: int;
    hugo: int;
BEGIN
    var = 0;
    hugo = 10;
    return var + hugo;
END.`

    const { syntaxTree } = new Pipeline1(sourceCode).start();

    const { expressions, tabelaDeSimbolos } = new Pipeline2(
      syntaxTree!
    ).start();

    const { nonOptimizedInstructions, optimizedInstructions } = new Pipeline3(expressions).start()

    // const mips = new Mips(tabelaDeSimbolos);
    // for (let i = 0; i < intermediario.totalComandos; ++i) {
    //   gerados.push({
    //     gerado: gerados[i],
    //     otimizado: optimizados[i],
    //     linha: expressions[i].extra!.linha,
    //   } as any);

    //   mips.adicionarInstrucoes(optimizados[i]);
    // }

    const d3tree = getReactD3Tree(syntaxTree!);

    expect(syntaxTree).toMatchSnapshot()
    expect(expressions).toMatchSnapshot()
    expect(tabelaDeSimbolos).toMatchSnapshot()
    // expect(intermediario).toMatchSnapshot()
    expect(nonOptimizedInstructions).toMatchSnapshot()
    expect(optimizedInstructions).toMatchSnapshot()
    // expect(mips).toMatchSnapshot()
    expect(d3tree).toMatchSnapshot()
  })

  it('Media teste', () => {
    const sourceCode = `VAR
    prova1: int;
    prova2: int;
    atividades: int;
  BEGIN
    prova1 = 9;
    prova2 = 8;
    atividades = 10;
    return (prova1 + prova2 + atividades) / 3;
  END.`

    const { syntaxTree } = new Pipeline1(sourceCode).start();

    const { expressions, tabelaDeSimbolos } = new Pipeline2(
      syntaxTree!
    ).start();

    const { nonOptimizedInstructions, optimizedInstructions } = new Pipeline3(expressions).start()

    // const mips = new Mips(tabelaDeSimbolos);
    // for (let i = 0; i < intermediario.totalComandos; ++i) {
    //   gerados.push({
    //     gerado: gerados[i],
    //     otimizado: optimizados[i],
    //     linha: expressions[i].extra!.linha,
    //   } as any);

    //   mips.adicionarInstrucoes(optimizados[i]);
    // }

    const d3tree = getReactD3Tree(syntaxTree!);

    expect(syntaxTree).toMatchSnapshot()
    expect(expressions).toMatchSnapshot()
    expect(tabelaDeSimbolos).toMatchSnapshot()
    // expect(intermediario).toMatchSnapshot()
    expect(nonOptimizedInstructions).toMatchSnapshot()
    expect(optimizedInstructions).toMatchSnapshot()
    // expect(mips).toMatchSnapshot()
    expect(d3tree).toMatchSnapshot()
  })
})