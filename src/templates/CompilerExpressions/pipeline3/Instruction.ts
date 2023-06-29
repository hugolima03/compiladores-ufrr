import getType from '../getType'

export default class Instruction {
    _operador: string
    _operando: string
    _argumentos: string[]

    constructor(operador: string, operando: string, argumentos: string[]) {
        this._operador = operador;
        this._operando = operando;
        this._argumentos = getType(argumentos) === 'object' ? argumentos : [];
    }

    get operando() { return this._operando; }
    get operador() { return this._operador; }
    get argumentos() { return [...this._argumentos]; }
    get totalArgs() { return this._argumentos.length; }

    argumento(indice: number) {
        if (indice < 0 || indice >= this.totalArgs) return null;
        return this._argumentos[indice];
    }

    copiar() {
        return new Instruction(this._operador, this._operando, [...this._argumentos]);
    }
}
