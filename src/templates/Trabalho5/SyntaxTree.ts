import Grammar from "./Grammar";
import Production from "./Production";

export default class SyntaxTree {
  name: string;
  children: SyntaxTree[];

  constructor(symbol: string) {
    this.name = symbol;
    this.children = [];
  }

  /**
   * Versão recursica da função para criar uma árvore sintática com lista de
   * produções pela esqueda
   */
  static _parseProductionsLeft(prods: Production[], gram: Grammar) {
    // Remove a primeira produção da lista
    const p = prods.shift();

    // Se não for válida, retorna null
    if (p === undefined) return null;

    // Cria um nó com o símbolo da cabeça da produção
    const node = new SyntaxTree(p.left);

    // Para cada símbolo do corpo...
    for (const s of p.right) {
      // Se ele for um terminal, apenas cria um nó e o adiciona como filho
      if (!gram.isNonTerminal(s)) {
        node.children.push(new SyntaxTree(s));
        continue;
      }

      // Se for um não terminal, chama recursivamente esta função
      const childNode = SyntaxTree._parseProductionsLeft(prods, gram);

      // Se o nó retornado for válido, adiciona-o como filho
      if (childNode !== null) node.children.push(childNode);
    }

    // Retorna o nó criado
    return node;
  }

  static _parseProductionsRight(prods: Production[], gram: Grammar) {

    // Remove a primeira produção da lista
    const p = prods.shift();

    // Se não for válida, retorna null
    if (p === undefined) return null;

    // Cria um nó com o símbolo da cabeça da produção
    const no = new SyntaxTree(p.left);

    // Para cada símbolo do corpo...
    for (const s of p.right.reverse()) {

      // Se ele for um terminal, apenas cria um nó e o adiciona como filho
      if (!gram.isNonTerminal(s)) {
        no.children.unshift(new SyntaxTree(s));
        continue;
      }

      // Se for um não terminal, chama recursivamente esta função
      const noFilho = SyntaxTree._parseProductionsRight(prods, gram);

      // Se o nó retornado for válido, adiciona-o como filho
      if (noFilho !== null) no.children.unshift(noFilho);
    }

    // Retorna o nó criado
    return no;
  }
}
