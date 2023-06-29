import getType from '../getType'

export default class Instruction {
    _operator: string
    _operand: string
    _arguments: string[]

    constructor(operator: string, operand: string, args: string[]) {
        this._operator = operator;
        this._operand = operand;
        this._arguments = getType(args) === 'object' ? args : [];
    }

    get operand() { return this._operand; }
    get operator() { return this._operator; }
    get args() { return [...this._arguments]; }
    get totalArgs() { return this._arguments.length; }

    arg(indice: number) {
        if (indice < 0 || indice >= this.totalArgs) return null;
        return this._arguments[indice];
    }

    copy() {
        return new Instruction(this._operator, this._operand, [...this._arguments]);
    }
}
