import Grammar from "templates/Trabalho5/Grammar";
import { Table } from "templates/Trabalho5/LL1";

type ESQDIR = {
  [key: string]: string[];
}

export default class PrecedenciaFraca {
  _gramatica: Grammar | null;
  _tabelaDR: Table | null;
  _inicial: string | null;
  _fdc: string | null;

  constructor() {
    this._gramatica = null;
    this._tabelaDR = null;
    this._inicial = null;
    this._fdc = null;
  }

  /**
   * Realiza a análise sintática de uma entrada e retorna uma lista de produções
   * @param  {string|[string]} entrada String ou lista de string como entrada
   * @return {[Producao]}
   */
  analisar(input: string) {
    const entrada = input.split(''); // lista de char

    // Adiciona o símbolo de fim de cadeia ao final da entrada
    let entradaPos = 0;
    entrada.push(this._fdc!);

    // Cria a pilha com o símbolo inicial e o símbolo de fim de cadadeia
    const pilha = [this._fdc];

    // Guarda todoas as produçòes da gramática
    const prods = this._gramatica?.productions;

    // Lista vazia de produções resultantes da análise
    const prodsResultado = [];

    // Enquanto tiver pelo menos 3 símbolos da pilha, OU não encontrar o fim
    // de cadeia da entrada E o topo da pilha não for o símbolo inicial...
    while (pilha.length > 2 || !(entrada[0] === this._fdc && pilha[0] === this._inicial)) {

      // Ler a ação da tabela DR no cruzamendo do símbolo do topo da pilha
      // (linha) e o símbolo atual da entrada (coluna)
      const acao = this._tabelaDR![pilha[0]!][entrada[0]];

      // Se a ação for D (deslocamento)
      if (acao === 'D') {
        // Retira o símbolo da entrada e o empilha
        pilha.unshift(entrada.shift()!);
        entradaPos++;
        continue;
      }

      // Se a ação for R (redução)
      if (acao === 'R') {

        // Calcula a quantidade de símbolos na pilha até o símbolo de
        // fim de cadeia
        let retirarPilha = pilha.length - 1;
        let prod = null;

        // Enquanto "retirarPilha" for maior que zero...
        while (retirarPilha > 0) {

          // Gera uma string com os símbolos do topo da pilha até o
          // valor de "retirarPilha" em ordem invertida
          const corpo = pilha.slice(0, retirarPilha).reverse().join('');

          // Procura uma produção com o corpo igual a string gerada
          prod = prods!.find(p => p.rightAsString === corpo);
          // Se encontrou uma produçao, para a busca
          if (prod !== undefined) break;

          // Se não, decrementa "retirarPilha"
          else retirarPilha--;
        }

        // Gera um erro, caso não tenha encontrado uma produção ao final
        // de todas as possiblidades de strings geradas a partir da pilha
        if (prod === null || prod === undefined) {
          throw {
            posicao: entradaPos,
            encontrado: entrada[0]
          };
        }

        // Remove da pilha todos os símbolos que casaram com o corpo da
        // produção encontrada
        pilha.splice(0, retirarPilha);

        // Adiciona ao topo da pilha o símbolo da cabeça da produção
        pilha.unshift(prod.left);

        // Adiciona a produção a lista de produções da análise
        prodsResultado.unshift(prod);
        continue;
      }

      // Gera um erro caso não foi definida uma ação para o cruzamendo
      throw {
        posicao: entradaPos,
        encontrado: entrada[0]
      };
    }

    return prodsResultado;
  }

  /**
   * Cria uma instância de PrecedenciaFraca
   * @param  {Gramatica} gram    Gramática que será utilizada para as analises
   * @param  {string} inicial Símbolo inicial da gramática
   * @param  {string} fdc     Símbolo de fim de cadeia
   * @return {PrecedenciaFraca}
   */
  static criar(gram: Grammar, inicial: string, fdc: string) {

    if (typeof (gram) !== 'object') {
      throw 'A gramática deve ser uma instância de Gramatica';
    }

    if (typeof (inicial) !== 'string') {
      throw 'O símbolo inicial deve ser uma string não vazia';
    }

    if (!gram.isNonTerminal(inicial)) {
      throw 'O símbolo inicial deve ser um símbolo não terminal da gramática';
    }

    if (typeof (fdc) !== 'string') {
      throw 'O símbolo de fim de cadeia deve ser uma string não vazia';
    }

    if (gram.isNonTerminal(fdc)) {
      throw 'O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática';
    }

    if (gram.terminals.includes(fdc) || gram.isEmptySymbol(fdc)) {
      throw 'O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática';
    }

    const precedenciaFraca = new PrecedenciaFraca();

    precedenciaFraca._tabelaDR = PrecedenciaFraca._criarTabelaDR(
      gram,
      inicial,
      fdc
    );

    precedenciaFraca._gramatica = gram;
    precedenciaFraca._inicial = inicial;
    precedenciaFraca._fdc = fdc;

    return precedenciaFraca;
  }

  /**
   * Gera a tabela Deslocamento-Redução com base em uma gramática
   * @param  {Gramatica} gram   Gramática que será utilizada como base
   * @param  {string} inicial Símbolo inicial da gramática
   * @param  {string} fdc     Símbolo de fim de cadeia que será utilizado nas análises
   * @return {object}
   */
  static _criarTabelaDR(gram: Grammar, inicial: string, fdc: string) {

    // Calcula as regras Wirth-Weber considerando o símbolo inicial e de fim
    // de cadeia
    const regrasWW = PrecedenciaFraca._calcularRegrasWirthWeberComFdc(
      gram,
      inicial,
      fdc
    );

    // Defeine os símbolos das colunas da tabela
    const sColunas = [
      ...gram.terminals.filter(s => !gram.isEmptySymbol(s)),
      fdc
    ];

    // Define os símbolos das linhas da tabela
    const sLinhas = [...gram.nonTerminals, ...sColunas];

    // Cria um objeto vazio chave-valor para a tabela
    const tabela: Table = {};

    // Para cada símbolo de linha...
    for (const sl of sLinhas) {

      // Cria um objeto vazio chave valor para a linha da tabela
      tabela[sl] = {};

      // Para cada símbolo de coluna...
      for (const sc of sColunas) {

        // Adiciona a ação D (deslocamento) para a relação <
        if (regrasWW.includes([sl, '<', sc].join(''))) {
          tabela[sl][sc] = 'D';
          continue;
        }

        // Adiciona a ação D (deslocamento) para a relação =
        if (regrasWW.includes([sl, '=', sc].join(''))) {
          tabela[sl][sc] = 'D';
          continue;
        }

        // Adiciona a ação R (redução) para a relação >
        if (regrasWW.includes([sl, '>', sc].join(''))) {
          tabela[sl][sc] = 'R';
          continue;
        }

        // Se não existe uma regra, deixa a celula vazia
        tabela[sl][sc] = null;
      }
    }

    return tabela;
  }

  /**
   * Calcula as regras de Wirth-Weber considerando os símbolos inicial e de
   * fim de cadeia
   * @param  {Gramatica} gram    Gramática que será utilizada como base
   * @param  {string} inicial Símbolo inicial
   * @param  {string} fdc     Símbolo de fim de cadeia
   * @return {Array}
   */
  static _calcularRegrasWirthWeberComFdc(gram: Grammar, inicial: string, fdc: string) {
    const regrasWW = PrecedenciaFraca._calcularRegrasWirthWeber(gram);
    const esq = PrecedenciaFraca._esq(gram);
    const dir = PrecedenciaFraca._dir(gram);
    for (const s of esq[inicial]) regrasWW.push([fdc, '<', s].join(''));
    for (const s of dir[inicial]) regrasWW.push([s, '>', fdc].join(''));
    return regrasWW;
  }

  /**
   * Calcula as regras de Wirth-Weber de uma gramática
   * @param  {Gramatica} gram Gramática que será utilizada como base
   * @return {Array}
   */
  static _calcularRegrasWirthWeber(gram: Grammar) {

    const prods = gram.productions;
    const simbolos = [
      ...gram.nonTerminals,
      ...gram.terminals.filter(s => !gram.isEmptySymbol(s))
    ];

    const regras1 = [];
    for (const s of simbolos) {
      for (const p of prods) {
        // Regra 1: existe algum símbolo imediatamente a direita do símbolo
        // atual (A -> aXYb, onde Y esta imediatamente a direita de X)
        const pos = p.right.indexOf(s);
        if (pos === -1) continue;
        if (pos === p.right.length - 1) continue;
        regras1.push([s, '=', p.right[pos + 1]]);
      }
    }

    const esq = PrecedenciaFraca._esq(gram);
    const dir = PrecedenciaFraca._dir(gram);
    const regras2e3 = [];

    for (const r of regras1) {

      // Regra 2: esquerda qualquer símbolo e direita não terminal
      if (gram.isNonTerminal(r[2])) {
        for (const s of esq[r[2]]) {
          regras2e3.push([r[0], '<', s]);
        }
      }

      // Regra 3: esquerda sempre não terminal
      if (!gram.isNonTerminal(r[0])) continue;

      // Regra 3.2: direita não terminal
      if (gram.isNonTerminal(r[2])) {
        for (const sd of dir[r[0]]) {
          for (const se of esq[r[2]]) {
            regras2e3.push([sd, '>', se]);
          }
        }
      }
      // Regra 3.1: direita terminal
      else {
        for (const s of dir[r[0]]) {
          regras2e3.push([s, '>', r[2]]);
        }
      }
    }

    return [...regras1, ...regras2e3].map((e => e.join('')));
  }

  /**
   * Calcula os conjuntos ESQ de uma gramática
   * @param  {Gramatica} gram Gramática base
   * @return {object}
   */
  static _esq(gram: Grammar): ESQDIR {

    const esqRerc = (snt: string) => {
      let esq: string[] = [];
      const prods = gram.getNonTerminalsProductions(snt);

      for (const p of prods) {

        if (!gram.isNonTerminal(p.right[0])) {
          esq.push(p.right[0]);
          continue;
        }

        if (p.right[0] === snt) continue;

        esq = [...esq, p.right[0], ...esqRerc(p.right[0])];
      }
      return esq.filter((i, p) => esq.indexOf(i) === p);;
    };

    const naoTermnais = gram.nonTerminals;
    const conjuntos: ESQDIR = {};

    for (const s of naoTermnais) {
      conjuntos[s] = esqRerc(s);
    }

    return conjuntos;
  }

  /**
   * Calcula os conjuntos DIR de uma gramática
   * @param  {Gramatica} gram Gramática base
   * @return {object}
   */
  static _dir(gram: Grammar): ESQDIR {

    const dirRerc = (snt: string) => {

      let dir: string[] = [];
      const prods = gram.getNonTerminalsProductions(snt);

      for (const p of prods) {
        const ultimoIndex = p.right.length - 1;

        if (!gram.isNonTerminal(p.right[ultimoIndex])) {
          dir.push(p.right[ultimoIndex]);
          continue;
        }

        if (p.right[ultimoIndex] === snt) continue;

        dir = [
          ...dir,
          p.right[ultimoIndex],
          ...dirRerc(p.right[ultimoIndex])
        ];
      }

      return dir.filter((i, p) => dir.indexOf(i) === p);
    };

    const naoTermnais = gram.nonTerminals;
    const conjuntos: ESQDIR = {};

    for (const s of naoTermnais) {
      conjuntos[s] = dirRerc(s);
    }

    return conjuntos;
  }
}
