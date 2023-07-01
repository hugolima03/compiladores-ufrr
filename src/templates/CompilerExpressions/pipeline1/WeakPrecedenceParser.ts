import ErroGramatical from "../exception/ErroGramatical";
import getType from "../getType";
import { Grammar } from "./Grammar";
import LexicoBuffer from "./TokensStack";
import { Lexeme } from "./Lexeme";

export class WeakPrecedenceParser {
  _tabelaDR: { [key: string]: any };
  _gramatica: Grammar;
  _inicial: string;
  _fdc: string;

  constructor(gram: Grammar, inicial: string, fdc: string) {
    this._tabelaDR = WeakPrecedenceParser._createDRTable(gram, inicial, fdc);
    this._gramatica = gram;
    this._inicial = inicial;
    this._fdc = fdc;
  }

  analyse(buffer: LexicoBuffer) {
    const pilha: any = [this._fdc];

    const prods = this._gramatica.producoes;

    const prodsResultado = [];

    const tokenTipo = (l: Lexeme | string) =>
      getType(l) === "object" ? (l as Lexeme).token.tipo : l;

    let atual = buffer.getNext;

    const WeakPrecedenceLoop = () => {
      return (
        pilha.length > 2 ||
        !(
          tokenTipo(atual!) === this._fdc &&
          tokenTipo(pilha[0]) === this._inicial
        )
      );
    };

    while (WeakPrecedenceLoop()) {
      const acao =
        this._tabelaDR[tokenTipo(pilha[0]) as string][
          tokenTipo(atual!) as string
        ];

      if (acao === "D") {
        pilha.unshift(atual!);
        atual = buffer.getNext;
        continue;
      }

      if (acao === "R") {
        let retirarPilha = pilha.length - 1;
        let prod = null;

        while (retirarPilha > 0) {
          const corpo = pilha
            .slice(0, retirarPilha)
            .map(tokenTipo)
            .reverse()
            .join(" ");

          prod = prods.find((p) => p.corpoStr === corpo);

          if (prod !== undefined) break;
          else retirarPilha--;
        }

        if (prod === null || prod === undefined) {
          throw ErroGramatical(atual as any);
        }

        pilha.splice(0, retirarPilha);

        pilha.unshift(prod.cabeca);

        prodsResultado.unshift(prod);
        continue;
      }

      throw ErroGramatical(atual as any);
    }

    return prodsResultado;
  }

  static _createDRTable(gram: Grammar, inicial: string, fdc: string) {
    const WWrules = WeakPrecedenceParser._findWirthWeberComFdcRules(
      gram,
      inicial,
      fdc
    );

    const sColunas = [
      ...gram._terminais.filter((s: string) => !gram.isEmptySymbol(s)),
      fdc,
    ];

    const sLinhas = [...gram._naoTerminais, ...sColunas];

    const tabela: { [key: string]: any } = {};

    for (const sl of sLinhas) {
      tabela[sl] = {};

      for (const sc of sColunas) {
        if (WWrules.includes([sl, "<", sc].join(""))) {
          tabela[sl][sc] = "D";
          continue;
        }

        if (WWrules.includes([sl, "=", sc].join(""))) {
          tabela[sl][sc] = "D";
          continue;
        }

        if (WWrules.includes([sl, ">", sc].join(""))) {
          tabela[sl][sc] = "R";
          continue;
        }

        tabela[sl][sc] = null;
      }
    }

    return tabela;
  }

  static _findWirthWeberComFdcRules(
    gram: Grammar,
    inicial: string,
    fdc: string
  ) {
    const WWrules = WeakPrecedenceParser._findWirthWeberRules(gram);
    const esq = WeakPrecedenceParser._leftSet(gram);
    const dir = WeakPrecedenceParser._rightSet(gram);
    for (const s of esq[inicial]) WWrules.push([fdc, "<", s].join(""));
    for (const s of dir[inicial]) WWrules.push([s, ">", fdc].join(""));
    return WWrules;
  }

  static _findWirthWeberRules(gram: Grammar) {
    const prods = gram.producoes;
    const simbolos = [
      ...gram._naoTerminais,
      ...gram._terminais.filter((s) => !gram.isEmptySymbol(s)),
    ];

    const regras1 = [];
    for (const s of simbolos) {
      for (const p of prods) {
        const pos = p.corpo.indexOf(s);
        if (pos === -1) continue;
        if (pos === p.corpo.length - 1) continue;
        regras1.push([s, "=", p.corpo[pos + 1]]);
      }
    }

    const esq = WeakPrecedenceParser._leftSet(gram);
    const dir = WeakPrecedenceParser._rightSet(gram);
    const regras2e3 = [];

    for (const r of regras1) {
      if (gram.isNonTerminalSymbol(r[2])) {
        for (const s of esq[r[2]]) {
          regras2e3.push([r[0], "<", s]);
        }
      }

      if (!gram.isNonTerminalSymbol(r[0])) continue;

      if (gram.isNonTerminalSymbol(r[2])) {
        for (const sd of dir[r[0]]) {
          for (const se of esq[r[2]]) {
            regras2e3.push([sd, ">", se]);
          }
        }
      } else {
        for (const s of dir[r[0]]) {
          regras2e3.push([s, ">", r[2]]);
        }
      }
    }

    return [...regras1, ...regras2e3].map((e) => e.join(""));
  }

  static _leftSet(gram: Grammar) {
    const leftRecursive = (snt: string) => {
      let esq: string[] = [];
      const prods = gram.buscarProducoesPorNaoTerminal(snt);

      for (const p of prods) {
        if (!gram.isNonTerminalSymbol(p.corpo[0])) {
          esq.push(p.corpo[0]);
          continue;
        }

        if (p.corpo[0] === snt) continue;

        esq = [...esq, p.corpo[0], ...leftRecursive(p.corpo[0])];
      }

      return esq.filter((i, p) => esq.indexOf(i) === p);
    };

    const nonTerminals = gram._naoTerminais;
    const sets: { [key: string]: string[] } = {};

    for (const s of nonTerminals) {
      sets[s] = leftRecursive(s);
    }

    return sets;
  }

  static _rightSet(gram: Grammar) {
    const rightRecursive = (snt: string) => {
      let dir: string[] = [];
      const prods = gram.buscarProducoesPorNaoTerminal(snt);

      for (const p of prods) {
        const ultimoIndex = p.corpo.length - 1;

        if (!gram.isNonTerminalSymbol(p.corpo[ultimoIndex])) {
          dir.push(p.corpo[ultimoIndex]);
          continue;
        }

        if (p.corpo[ultimoIndex] === snt) continue;

        dir = [
          ...dir,
          p.corpo[ultimoIndex],
          ...rightRecursive(p.corpo[ultimoIndex]),
        ];
      }

      return dir.filter((i, p) => dir.indexOf(i) === p);
    };

    const nonTerminals = gram._naoTerminais;
    const sets: { [key: string]: string[] } = {};

    for (const s of nonTerminals) {
      sets[s] = rightRecursive(s);
    }

    return sets;
  }
}
