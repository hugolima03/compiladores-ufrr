import Production from "./Production";

export default class Grammar {
  terminals: string[]
  nonTerminals: string[]
  _productions: { [key: string]: Production[] }
  _empty: string

  constructor() {
    this.terminals = [];
    this.nonTerminals = [];
    this._productions = {};
    this._empty = "";
  }

  get empty() {
    return this._empty;
  }

  get productions() {
    let productions: Production[] = [];
    for (const snt of this.nonTerminals) {
      productions = [...productions, ...this.getNonTerminalsProductions(snt)];
    }
    return productions;
  }

  getNonTerminalsProductions(nonTerminal: string) {
    if (typeof this._productions[nonTerminal] === "undefined") {
      throw "O símbolo não terminai não foi definido";
    }

    return this._productions[nonTerminal];
  }

  getNonTerminalsOccurrencesIndexes(input: string) {
    const regex = new RegExp(this.nonTerminals.join("|"), "g");
    const found = Array.from(input.matchAll(regex));

    const occurrences: { [key: string]: number[] } = {};
    for (const symbol of found) {
      const nonTerminal = symbol[0]
      if (typeof occurrences[nonTerminal] === "undefined") occurrences[nonTerminal] = [];

      occurrences[nonTerminal].push(symbol.index!);
    }
    return occurrences;
  }

  isNonTerminal(symbol: string) {
    return this.nonTerminals.includes(symbol);
  }

  isEmptySymbol(symbol: string) {
    return this.empty === symbol;
  }

  static createGrammar(productions: { [key: string]: string[] }, emptySymbol: string) {
    const gram = new Grammar();

    gram.nonTerminals = Object.keys(productions);
    gram._empty = emptySymbol;


    let terminais: string[] = [];
    for (const synbol of gram.nonTerminals) {
      gram._productions[synbol] = [];
      const prods = productions[synbol];

      for (const production of prods) {
        const productionBody = Grammar.parseProductionBody(
          production,
          gram.getNonTerminalsOccurrencesIndexes(production as string)
        );

        gram._productions[synbol].push(new Production(synbol, productionBody, gram.empty));

        terminais = [
          ...terminais,
          ...productionBody.filter((i, p) => !gram.nonTerminals.includes(i)), // filter nonTerminals
        ];
      }
    }

    gram.terminals = terminais.filter((i, p) => terminais.indexOf(i) === p); // remove duplicated entries
    return gram;
  }

  static parseProductionBody(input: string, occurrences: { [key: string]: number[] }) {
    // Gera a lista de não terminais presentes na string
    const nonTerminals = Object.keys(occurrences);

    // Se não existir não terminais, apenas transforma a string em lista
    if (nonTerminals.length === 0) return input.split('');

    // Gera uma lista contento todas as posições onde a string deve ser quebrada
    let splitIndexes = [0];
    for (const snt of nonTerminals) {
      for (const o of occurrences[snt]) {
        splitIndexes.push(o);
        splitIndexes.push(o + snt.length);
      }
    }
    splitIndexes.push(input.length);

    // Remove valores repetidos e os ordena
    splitIndexes = splitIndexes
      .filter((i, p) => splitIndexes.indexOf(i) === p)
      .sort();

    // Gera a lista de símbolos
    let body: string[] = [];
    for (let i = 0; i < splitIndexes.length - 1; i++) {
      // Pega a parte da string na posição atual
      const substr = input.substring(splitIndexes[i], splitIndexes[i + 1]);

      // Se símbolo for um não terminal, apenas adiciona a lista
      if (nonTerminals.includes(substr)) body.push(substr);
      //Se fpr um terminal, concatenada a lista de símbolos na lista final
      else body = [...body, ...substr.split('')];
    }

    return body;
  }
}
