import { patterns } from "../utils/Patterns";
import { Lexeme } from "./Lexeme";

/**
 * Classe auxiliar utilizada durante o reconhecimento dos tokens na análise sintática. Retorna uma estrutura com lista de Lexemas.
 *
 * Etapas:
 *
 * - Recebe todo o arquivo
 * - Divide a entrada em linha
 * - Chama a função callback passada que retorna os tokens da linha.
 */
export default class TokensStack {
  _handle: (linha: string, index: number) => Lexeme[];
  _linhas: string[];
  _linhaAtual: number;
  _buffer: Lexeme[];
  _eof: string;

  constructor(
    handle: (linha: string, index: number) => Lexeme[],
    eof: string,
    entrada: string
  ) {
    this._handle = handle;
    this._linhas = entrada.split(patterns.EOL);
    this._linhaAtual = 0;
    this._buffer = [];
    this._eof = eof;
  }

  /**
   * Retorna o próximo token do buffer. Caso o buffer esteja vazio, adiciona os tokens da linha em análise.
   */
  get proximo() {
    while (this._buffer.length === 0) {
      if (this._linhas.length === 0) return this._eof; // Acabou as linhas, fim do arquivo

      const tokens = this._handle(this._linhas.shift()!, this._linhaAtual++);
      this._buffer = tokens;
    }

    return this._buffer.shift();
  }
}
