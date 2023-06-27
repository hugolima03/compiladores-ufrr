import SimboloIdentificador from "./SimboloIdentificador";

import ErroSemantico from "../exception/ErroSemantico";

import { Tree } from "../pipeline1/Tree";

export default class Pipeline2 {
  _syntaxTree: Tree;
  _symbolList: SimboloIdentificador[];

  constructor(arvore: Tree) {
    this._syntaxTree = arvore;
    this._symbolList = [];
  }

  get symbolList() {
    return [...this._symbolList];
  }

  _getSymbol(nome?: string) {
    return this._symbolList.find((s) => s.nome === nome);
  }

  _isUndefined(nome?: string) {
    return this._getSymbol(nome) !== undefined;
  }

  _validateIdentifier(identificador: Tree, tipo?: string) {
    const variavel = this._getSymbol(identificador.extra?.palavra);
    if (variavel === undefined) {
      throw ErroSemantico(identificador.extra, "variavel-nao-declarada");
    }

    if (typeof tipo !== "string") return variavel;
    if (variavel.tipo !== tipo) {
      throw ErroSemantico(identificador.extra, "tipo-incompativel");
    }

    return variavel;
  }

  generateSymbolTable() {
    const bloco = this._syntaxTree.findAllNodes("<bloco_declaracao>", 1);
    if (bloco.length === 0) return;

    const declaracoes = bloco[0].findAllNodes("<declaracao>");
    for (const dec of declaracoes) {
      const id = dec.findAllNodes("identificador", 1)[0];
      const tipo = dec.findAllNodes("<declaracao_tipo>")[0].nos[0];

      if (this._isUndefined(id.extra?.palavra)) {
        throw ErroSemantico(id.extra, "redeclaracao");
      }

      this._symbolList.push(
        new SimboloIdentificador(
          id.extra!.palavra,
          tipo.extra!.palavra,
          id.extra!.token
        )
      );
    }
  }

  _validateAssignment(atribuicao: Tree) {
    const id = atribuicao.findAllNodes("identificador", 1)[0];
    const variavel = this._validateIdentifier(id);

    const esquerda = new Tree(id.extra!.palavra);
    esquerda.extra = id.extra;

    const atrOperador = atribuicao.findAllNodes("especial-atr", 1)[0];

    const direita = this._validateExpression(
      atribuicao.findAllNodes("<expressao>", 2)[0],
      variavel.tipo
    );

    const arvore = new Tree(atrOperador.extra!.palavra);
    arvore.extra = atrOperador.extra;
    arvore._nos = [esquerda, direita];

    return arvore;
  }

  _validateReturn(retorne: Tree) {
    const no = this._validateExpression(
      retorne.findAllNodes("<expressao>", 2)[0],
      "int"
    );

    const arvore = new Tree(retorne.nos[0].extra!.palavra);
    arvore.extra = retorne.nos[0].extra;
    arvore._nos = [no];

    return arvore;
  }

  _validateExpression(expressao: Tree, tipo: string) {
    const nos = expressao.nos;

    if (nos[0].simbolo === "<expressao>") {
      const atual = new Tree(nos[1].extra!.palavra);
      atual.extra = nos[1].extra;

      const esquerda = this._validateExpression(nos[0], tipo);
      const direita = this._validateExpressionTerm(nos[2], tipo);

      atual._nos = [esquerda, direita];
      return atual;
    }

    if (nos[0].simbolo === "op-aritmetico-sub") {
      const atual = new Tree(nos[0].extra!.palavra);
      atual.extra = nos[0].extra;

      const filho = this._validateExpressionTerm(nos[1], tipo);
      atual._nos = [filho];

      return atual;
    }

    return this._validateExpressionTerm(nos[0], tipo);
  }

  _validateExpressionTerm(termo: Tree, tipo: string) {
    const nos = termo.nos;

    if (nos[0].simbolo === "<expressao_termo>") {
      const atual = new Tree(nos[1].extra!.palavra);
      atual.extra = nos[1].extra;

      const esquerda = this._validateExpressionTerm(nos[0], tipo);
      const direita = this._validateExpressionFator(nos[2], tipo);

      atual._nos = [esquerda, direita];
      return atual;
    }

    return this._validateExpressionFator(nos[0], tipo);
  }

  _validateExpressionFator(fator: Tree, tipo: string): Tree {
    const nos = fator.nos;

    if (nos[0].simbolo === "identificador") {
      this._validateIdentifier(nos[0], tipo);
      const atual = new Tree(nos[0].extra!.palavra);
      atual.extra = nos[0].extra;
      return atual;
    }

    if (nos[0].simbolo === "<literal>") {
      const literal = nos[0];
      const atual = new Tree(literal.nos[0].extra!.palavra);
      atual.extra = literal.nos[0].extra;

      if (atual.extra!.token.classe.split("-")[1] !== tipo) {
        throw ErroSemantico(atual.extra, "tipo-incompativel");
      }

      return atual;
    }

    return this._validateExpression(nos[1], tipo);
  }

  start() {
    // Step 1: Gerar tabela de símbolos
    this.generateSymbolTable();

    // Step 2: Validar comandos
    const bloco = this._syntaxTree.findAllNodes("<bloco_principal>", 1)[0];
    const comandos = bloco.findAllNodes("<comando>");
    const arvoresDeExpressoes = [];

    for (const c of comandos) {
      switch (c.nos[0].simbolo) {
        case "<atribuicao>": // Step 2.1: Validar atribuição
          arvoresDeExpressoes.push(this._validateAssignment(c.nos[0]));
          break;
        case "<retorne_principal>": // Step 2.2: Validar retorno
          arvoresDeExpressoes.push(this._validateReturn(c.nos[0]));
          break;
        default:
          throw ErroSemantico("", "comando-invalido");
      }
    }
 
    return {
      arvoresDeExpressoes,
      tabelaDeSimbolos: this.symbolList,
    };
  }
}
