import Grammar from "templates/Trabalho5/Grammar";
import { Table } from "templates/Trabalho5/LL1";

type ESQDIR = {
  [key: string]: string[];
};

export default class WeakPrecedenceParser {
  sentential?: string;
  delimiter?: string;
  grammar?: Grammar;
  table?: Table;

  constructor() {
    this.sentential = undefined;
    this.delimiter = undefined;
    this.grammar = undefined;
    this.table = undefined;
  }

  analyse(line: string) {
    const input = line.split("");

    let inputIndex = 0;
    input.push(this.delimiter!);

    const stack = [this.delimiter];
    const prods = this.grammar?.productions;
    const prodsResult = [];

    // Enquanto tiver pelo menos 3 símbolos da pilha, OU não encontrar o fim
    // de cadeia da entrada E o topo da pilha não for o símbolo inicial...
    while (
      stack.length > 2 ||
      !(input[0] === this.delimiter && stack[0] === this.sentential)
    ) {
      const action = this.table![stack[0]!][input[0]];

      if (action === "D") {
        stack.unshift(input.shift()!);
        inputIndex++;
        continue;
      }

      if (action === "R") {
        // Calcula a quantidade de símbolos na pilha até o símbolo de
        // fim de cadeia
        let retirarPilha = stack.length - 1;
        let prod = null;

        while (retirarPilha > 0) {
          // Gera uma string com os símbolos do topo da pilha até o
          // valor de "retirarPilha" em ordem invertida
          const corpo = stack.slice(0, retirarPilha).reverse().join("");

          // Procura uma produção com o corpo igual a string gerada
          prod = prods!.find((p) => p.rightAsString === corpo);
          // Se encontrou uma produçao, para a busca
          if (prod !== undefined) break;
          // Se não, decrementa "retirarPilha"
          else retirarPilha--;
        }

        // Gera um erro, caso não tenha encontrado uma produção ao final
        // de todas as possiblidades de strings geradas a partir da pilha
        if (prod === null || prod === undefined) {
          throw {
            posicao: inputIndex,
            encontrado: input[0],
          };
        }

        // Remove da pilha todos os símbolos que casaram com o corpo da
        // produção encontrada
        stack.splice(0, retirarPilha);

        // Adiciona ao topo da pilha o símbolo da cabeça da produção
        stack.unshift(prod.left);

        // Adiciona a produção a lista de produções da análise
        prodsResult.unshift(prod);
        continue;
      }

      // Gera um erro caso não foi definida uma ação para o cruzamendo
      throw {
        posicao: inputIndex,
        encontrado: input[0],
      };
    }

    return prodsResult;
  }

  static create(gram: Grammar, inicial: string, fdc: string) {
    const weakPrecedenceParser = new WeakPrecedenceParser();

    weakPrecedenceParser.table = WeakPrecedenceParser.createDRTable(
      gram,
      inicial,
      fdc
    );

    weakPrecedenceParser.grammar = gram;
    weakPrecedenceParser.sentential = inicial;
    weakPrecedenceParser.delimiter = fdc;

    return weakPrecedenceParser;
  }

  static createDRTable(gram: Grammar, inicial: string, fdc: string) {
    const wirthWeberRelations = WeakPrecedenceParser.getSentintialWirthWeberRelations(
      gram,
      inicial,
      fdc
    );

    const sColumns = [
      ...gram.terminals.filter((s) => !gram.isEmptySymbol(s)),
      fdc,
    ];

    const sRows = [...gram.nonTerminals, ...sColumns];

    const table: Table = {};

    // Para cada símbolo de linha...
    for (const sl of sRows) {
      // Cria um objeto vazio chave valor para a linha da tabela
      table[sl] = {};

      // Para cada símbolo de coluna...
      for (const sc of sColumns) {
        // Adiciona a ação D (deslocamento) para a relação <
        if (wirthWeberRelations.includes([sl, "<", sc].join(""))) {
          table[sl][sc] = "D";
          continue;
        }

        // Adiciona a ação D (deslocamento) para a relação =
        if (wirthWeberRelations.includes([sl, "=", sc].join(""))) {
          table[sl][sc] = "D";
          continue;
        }

        // Adiciona a ação R (redução) para a relação >
        if (wirthWeberRelations.includes([sl, ">", sc].join(""))) {
          table[sl][sc] = "R";
          continue;
        }

        // Se não existe uma regra, deixa a celula vazia
        table[sl][sc] = '-';
      }
    }

    return table;
  }

  static getSentintialWirthWeberRelations(
    gram: Grammar,
    inicial: string,
    fdc: string
  ) {
    const regrasWW = WeakPrecedenceParser.getlWirthWeberRelations(gram);
    const esq = WeakPrecedenceParser.getLeftSet(gram);
    const dir = WeakPrecedenceParser.getRightSet(gram);
    for (const s of esq[inicial]) regrasWW.push([fdc, "<", s].join(""));
    for (const s of dir[inicial]) regrasWW.push([s, ">", fdc].join(""));
    return regrasWW;
  }

  static getlWirthWeberRelations(gram: Grammar) {
    const productions = gram.productions;
    const symbols = [
      ...gram.nonTerminals,
      ...gram.terminals.filter((s) => !gram.isEmptySymbol(s)),
    ];

    const rule1 = [];
    for (const s of symbols) {
      for (const p of productions) {
        // Rule 1: existe algum símbolo imediatamente a direita do símbolo
        // atual (A -> aXYb, onde Y esta imediatamente a direita de X)
        const pos = p.right.indexOf(s);
        if (pos === -1) continue;
        if (pos === p.right.length - 1) continue;
        rule1.push([s, "=", p.right[pos + 1]]);
      }
    }

    const esq = WeakPrecedenceParser.getLeftSet(gram);
    const dir = WeakPrecedenceParser.getRightSet(gram);
    const rules2_3 = [];

    for (const r of rule1) {
      // Rule 2: esquerda qualquer símbolo e direita não terminal
      if (gram.isNonTerminal(r[2])) {
        for (const s of esq[r[2]]) {
          rules2_3.push([r[0], "<", s]);
        }
      }

      // Rule 3: esquerda sempre não terminal
      if (!gram.isNonTerminal(r[0])) continue;

      // Rule 3.2: direita não terminal
      if (gram.isNonTerminal(r[2])) {
        for (const sd of dir[r[0]]) {
          for (const se of esq[r[2]]) {
            rules2_3.push([sd, ">", se]);
          }
        }
      }
      // Rule 3.1: direita terminal
      else {
        for (const s of dir[r[0]]) {
          rules2_3.push([s, ">", r[2]]);
        }
      }
    }

    return [...rule1, ...rules2_3].map((e) => e.join(""));
  }

  static getLeftSet(gram: Grammar): ESQDIR {
    const leftRerc = (snt: string) => {
      let left: string[] = [];
      const prods = gram.getNonTerminalsProductions(snt);

      for (const p of prods) {
        if (!gram.isNonTerminal(p.right[0])) {
          left.push(p.right[0]);
          continue;
        }

        if (p.right[0] === snt) continue;

        left = [...left, p.right[0], ...leftRerc(p.right[0])];
      }
      return left.filter((i, p) => left.indexOf(i) === p);
    };

    const nonTerminals = gram.nonTerminals;
    const sets: ESQDIR = {};

    for (const s of nonTerminals) {
      sets[s] = leftRerc(s);
    }
    return sets;
  }

  static getRightSet(gram: Grammar): ESQDIR {
    const rightRerc = (snt: string) => {
      let right: string[] = [];
      const prods = gram.getNonTerminalsProductions(snt);

      for (const p of prods) {
        const lastIndex = p.right.length - 1;

        if (!gram.isNonTerminal(p.right[lastIndex])) {
          right.push(p.right[lastIndex]);
          continue;
        }

        if (p.right[lastIndex] === snt) continue;

        right = [
          ...right,
          p.right[lastIndex],
          ...rightRerc(p.right[lastIndex]),
        ];
      }

      return right.filter((i, p) => right.indexOf(i) === p);
    };

    const nonTerminals = gram.nonTerminals;
    const sets: ESQDIR = {};

    for (const s of nonTerminals) {
      sets[s] = rightRerc(s);
    }

    return sets;
  }
}
