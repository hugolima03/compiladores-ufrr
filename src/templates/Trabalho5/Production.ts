export default class Production {
  _left: string;
  _right: string[];
  _emptySymbol: string;

  constructor(left: string, right: string[], empty: string) {
    this._left = left;
    this._right = right;
    this._emptySymbol = empty;
  }

  get left() {
    return this._left;
  }

  get right() {
    return [...this._right];
  }

  get rightAsString() {
    return this._right.join("");
  }

  get asString() {
    return [this.left, " -> ", this.right].join("");
  }

  applyByLeft(entrada: string) {
    return this.applyProduction(entrada, entrada.indexOf(this.left));
  }

  applyByRight(entrada: string) {
    return this.applyProduction(entrada, entrada.lastIndexOf(this.left));
  }

  applyProduction(entrada: string, posicao: number) {
    if (posicao < 0 || posicao >= entrada.length) return entrada;
    if (entrada.substr(posicao, this.left.length) !== this.left) return entrada;

    const eachChar = entrada.split("");
    return [
      ...eachChar.slice(0, posicao),
      ...this.right.filter((s) => s !== this._emptySymbol),
      ...eachChar.slice(posicao + this.left.length),
    ].join("");
  }
}
