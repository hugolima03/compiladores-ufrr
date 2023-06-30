import grammar from './Rules';

import { LexicalAnalyser } from './LexicalAnalyser';
import { Tree } from './Tree';
import { Lexeme } from './Lexeme';
import TokensStack from './TokensStack';
import { WeakPrecedenceParser } from './WeakPrecedenceParser';

export default class Pipeline1 {
  _sourceCode: string
  _lexico: LexicalAnalyser
  _analisador: WeakPrecedenceParser

  constructor(sourceCode: string) {
    this._sourceCode = sourceCode
    this._lexico = new LexicalAnalyser();
    this._analisador = new WeakPrecedenceParser(grammar, '<program>', '$');
  }

  start() {
    console.log('PIPELINE 1... START!')

    let lexemas: Lexeme[] = [];
    const parsearLexemas = (lineContent: string, lineIndex: number) => {
      const ls = this._lexico.tokenizarLinha(lineContent, lineIndex);
      // adiciona os lexemas encontrados em cada linha na lista de lexemas do arquivo
      lexemas = [...[...ls].reverse(), ...lexemas];
      return ls;
    }

    // Step 1: Análise Léxica e Sintática
    const prods = this._analisador.analisar(new TokensStack(parsearLexemas, '$', this._sourceCode));

    // Step 2: Geração da árvore sintática
    const arvore = Tree.parsearProducoes(prods, grammar);
    arvore?.posOrdem((n) => {
      if (!n.ehFolha) return;
      if (n.simbolo !== lexemas[0].token.tipo) return;
      n.extra = lexemas.shift()!;
    });

    return arvore;
  }
}
