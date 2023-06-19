import Production from "./Production";

export default class Grammar {
  _terminais: string[]
  _naoTerminais: string[]
  _producoes: { [key: string]: Production[] }
  _vazio: string

  constructor() {
    this._terminais = [];
    this._naoTerminais = [];
    this._producoes = {};
    this._vazio = "";
  }

  /**
   * Busca por todas produções de um determinado símbolo não terminal
   */
  _buscarProducoesPorNaoTerminal(snt: string) {
    // Verifica se o símbolo não terminal existe na gramática
    if (typeof this._producoes[snt] === "undefined") {
      throw "O símbolo não terminai não foi definido";
    }

    // Se existir, retorna suas produções
    return this._producoes[snt];
  }

  /**
   * Verifica uma string e procura todas ocorrências de símbolos não terminais
   * da gramática
   */
  _ocorrenciasDeNaoTermiais(entrada: string) {
    // Utiliza expressão regular para encontrar os não terminais na entrada
    const regex = new RegExp(this._naoTerminais.join("|"), "g");
    const encontrados = Array.from(entrada.matchAll(regex));
    // Cria um objeto vazio
    const ocorrencias: { [key: string]: number[] } = {};

    // Para cada ocorrencia encontrada...
    for (const e of encontrados) {
      if (typeof ocorrencias[e[0]] === "undefined") ocorrencias[e[0]] = [];

      // Adiciona a posição do símbolo a lista de ocorrências
      ocorrencias[e[0]].push(e.index!);
    }
    // Retorna as ocorrências
    return ocorrencias;
  }

  /**
   * Verifica se em uma string existe a ocorrência de algum símbolo não
   * terminal da gramáitica
   */
  existeNaoTerminal(entrada: string) {
    return Object.keys(this._ocorrenciasDeNaoTermiais(entrada)).length > 0;
  }

  /**
   * Varifica se um símblo é um não terminal na gramática
   */
  simboloEhNaoTerminal(simbolo: string) {
    return this._naoTerminais.includes(simbolo);
  }

  /**
   * Verifica se o um símbolo é o símbolo vazio da gramática
   */
  simboloEhVazio(simbolo: string) {
    return this._vazio === simbolo;
  }

  /**
   * Retorna uma produção de um símbolo não terminal válido na gramática
   */
  producao(snt: string, indice: number) {
    if (typeof indice !== "number") indice = 0;

    const producoes = this._buscarProducoesPorNaoTerminal(snt);
    if (indice < 0 || indice >= producoes.length) {
      throw "Produção é inválida";
    }

    return producoes[indice];
  }

  /**
   * Retorna uma lista de todas a produções da gramática
   */
  get producoes() {
    let producoes: Production[] = [];
    for (const snt of this._naoTerminais) {
      producoes = [...producoes, ...this._buscarProducoesPorNaoTerminal(snt)];
    }
    return producoes;
  }

  /**
   * Cria e inicializa uma instância de Gramatica
   */
  static criar(producoes: { [key: string]: string[] }, vazio: string) {
    if (typeof producoes !== "object") {
      throw "As produções devem ser um objeto chave valor não vazio";
    }

    if (typeof vazio !== "string" || vazio.length > 1) {
      throw "O símbolo vazio deve ser um string com tamanho 1";
    }

    // Cria a instância de Gramatica e define os símbolos não terminais
    const gram = new Grammar();
    gram._naoTerminais = Object.keys(producoes);

    if (gram._naoTerminais.length === 0) {
      throw "As produções devem ser um objeto chave valor não vazio";
    }

    // O símbolo vazio não pode ser um símbolo não terminal
    if (gram.simboloEhNaoTerminal(vazio)) {
      throw "O símbolo não pode ser um símbolo não terminal";
    }
    gram._vazio = vazio;

    // Para cada símbolo não terminal...
    let terminais: string[] = [];
    for (const snt of gram._naoTerminais) {
      gram._producoes[snt] = [];

      // Valida e cria as produções
      const prods = producoes[snt];

      // Para cada símbolo terminal referente as produções do símbolo não
      // termial atual...
      for (const st of prods) {
        // Gera uma lista com todos os símbolos do corpo
        const corpo = Grammar._parsearCorpoProducao(
          st,
          gram._ocorrenciasDeNaoTermiais(st as string)
        );

        // Cria uma instância de Produção e adiciona a gramática
        gram._producoes[snt].push(new Production(snt, corpo, gram._vazio));

        // Guarda todos os símbolos terminais em uma lista
        terminais = [
          ...terminais,
          ...corpo.filter((i, p) => !gram._naoTerminais.includes(i)),
        ];
      }
    }

    // Ao terminar de criar todas as produções, remove ocorrências repetidas
    // de símbolos terminais
    gram._terminais = terminais.filter((i, p) => terminais.indexOf(i) === p);

    // Retorna a instância de Gramatica
    return gram;
  }

  /**
   * Transforma uma string em uma lista de símbolos terminais e não terminais
   */
  static _parsearCorpoProducao(str: string, ocorrencias: { [key: string]: number[] }) {
    // Gera a lista de não terminais presentes na string
    const naoTermnais = Object.keys(ocorrencias);

    // Se não existir não terminais, apenas transforma a string em lista
    if (naoTermnais.length === 0) return str.split('');

    // Gera uma lista contento todas as posições onde a string deve ser quebrada
    let locaisDivisao = [0];
    for (const snt of naoTermnais) {
      for (const o of ocorrencias[snt]) {
        locaisDivisao.push(o);
        locaisDivisao.push(o + snt.length);
      }
    }
    locaisDivisao.push(str.length);

    // Remove valores repetidos e os ordena
    locaisDivisao = locaisDivisao
      .filter((i, p) => locaisDivisao.indexOf(i) === p)
      .sort();

    // Gera a lista de símbolos
    let corpo: string[] = [];
    for (let i = 0; i < locaisDivisao.length - 1; i++) {
      // Pega a parte da string na posição atual
      const substr = str.substring(locaisDivisao[i], locaisDivisao[i + 1]);

      // Se símbolo for um não terminal, apenas adiciona a lista
      if (naoTermnais.includes(substr)) corpo.push(substr);
      //Se fpr um terminal, concatenada a lista de símbolos na lista final
      else corpo = [...corpo, ...substr.split('')];
    }

    return corpo;
  }
}
