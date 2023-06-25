import getType from '../getType.mjs'
export default class Instrucao {

    constructor(operador, operando, argumentos) {
        this._operador = operador;
        this._operando = operando;
        this._argumentos = getType(argumentos) === 'object' ? argumentos : [];
    }

    get operando() { return this._operando; }
    get operador() { return this._operador; }
    get argumentos() { return [...this._argumentos]; }
    get totalArgs() { return this._argumentos.length; }

    argumento(indice) {
        if(indice < 0 || indice >= this.totalArgs) return null;
        return this._argumentos[indice];
    }

    comoString() {
        return [
            this.operador,
            '(',
            ...this._argumentos,
            ')',
            '->',
            this.operando
        ].join(' ');
    }

    copiar() {
        return new Instrucao(this._operador, this._operando, [...this._argumentos]);
    }
}
