import getType from '../getType';
import gramatica from '../sintatico/Regras';

import { LexicalAnalyser } from '../lexico/LexicalAnalyser';
import { Tree } from '../sintatico/Tree';
import { Lexeme } from '../lexico/Lexeme';
import TokensStack from '../lexico/TokensStack';
import PrecedenciaFraca from '../sintatico/PrecedenciaFraca';

export default class Pipeline1 {
  _sorceCode: string
  _lexico: LexicalAnalyser
  _analisador: PrecedenciaFraca

  constructor(sourceCode: string) {
    this._sorceCode = sourceCode
    this._lexico = new LexicalAnalyser();
    this._analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
  }

  parsearProducoes(entrada: string, handle: any) {
    if (getType(handle) !== 'function') handle = this._lexico.tokenizarLinha;
    return this._analisador.analisar(new TokensStack(handle, '$', entrada));
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

    const prods = this.parsearProducoes(this._sorceCode, parsearLexemas);

    const arvore = Tree.parsearProducoes(prods, gramatica);
    arvore?.posOrdem((n) => {
      if (!n.ehFolha) return;
      if (n.simbolo !== lexemas[0].token.tipo) return;
      n.extra = lexemas.shift()!;
    });

    return arvore;
  }
}
