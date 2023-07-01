import { PascalGrammar } from "./PascalGrammar";

import { LexicalAnalyser } from "./LexicalAnalyser";
import { Tree } from "./Tree";
import { Lexeme } from "./Lexeme";
import TokensStack from "./TokensStack";
import { WeakPrecedenceParser } from "./WeakPrecedenceParser";

export default class Pipeline1 {
  _sourceCode: string;
  _lexicalAnalyser: LexicalAnalyser;
  _weakPrecedenceParser: WeakPrecedenceParser;

  constructor(sourceCode: string) {
    this._sourceCode = sourceCode;
    this._lexicalAnalyser = new LexicalAnalyser();
    this._weakPrecedenceParser = new WeakPrecedenceParser(
      PascalGrammar,
      "<program>",
      "$"
    );
  }

  start() {
    console.log("PIPELINE 1... START!");

    let lexemes: Lexeme[] = [];
    const parseLexemes = (lineContent: string, lineIndex: number) => {
      const ls = this._lexicalAnalyser.tokenizeRow(lineContent, lineIndex);
      // adiciona os lexemas encontrados em cada linha na lista de lexemas do arquivo
      lexemes = [...[...ls].reverse(), ...lexemes];
      return ls;
    };

    // Step 1: Análise Léxica e Sintática
    const productions = this._weakPrecedenceParser.analyse(
      new TokensStack(parseLexemes, "$", this._sourceCode)
    );

    // Step 2: Geração da árvore sintática
    const syntaxTree = Tree.parseProductions(productions, PascalGrammar);
    syntaxTree?.postOrder((n) => {
      if (!n.ehFolha) return;
      if (n.simbolo !== lexemes[0].token.tipo) return;
      n.extra = lexemes.shift()!;
    });

    return { syntaxTree, weakPrecedenceParser: this._weakPrecedenceParser };
  }
}
