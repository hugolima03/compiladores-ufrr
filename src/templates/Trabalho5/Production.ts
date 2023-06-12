export default class Production {
    _left: string
    _right: string[]
    _emptySymbol: string

    constructor(left: string, right: string[], empty: string) {
        this._left = left;
        this._right = right;
        this._emptySymbol = empty;
    }

    get left() { return this._left; }

    get right() { return [...this._right]; }

    get rightAsString() { return this._right.join(''); }

    get asString() {
        return [this.left, ' -> ', this.right].join('');
    }

    /**
     * Aplica a produção na string de entrada pela esquerda na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     */
    applyByLeft(entrada: string) {
        return this.applyProduction(entrada, entrada.indexOf(this.left));
    }

    /**
     * Aplica a produção na string de entrada pela direita na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     */
    applyByRight(entrada: string) {
        return this.applyProduction(entrada, entrada.lastIndexOf(this.left));
    }

    /**
     * Aplica a produção na string de entrada em uma posição válida que corresponde
     * ao símbolo da cabeça, caso a posição não seja válida, apenas retorna a
     * string de entrada
     */
    applyProduction(entrada: string, posicao: number) {
        if (posicao < 0 || posicao >= entrada.length) return entrada;
        if (entrada.substr(posicao, this.left.length) !== this.left) return entrada;

        const eachChar = entrada.split('');
        return [
            ...eachChar.slice(0, posicao),
            ...this.right.filter(s => s !== this._emptySymbol),
            ...eachChar.slice(posicao + this.left.length),
        ].join('');
    }
}
