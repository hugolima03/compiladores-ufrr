import Token from "../pipeline1/Token";

export default class SimboloIdentificador {
    _nome: string
    _tipo: string
    _token: Token
    constructor(nome: string, tipo: string, token: Token) {
        this._nome = nome;
        this._tipo = tipo;
        this._token = token;
    }

    get nome() { return this._nome; }
    get tipo() { return this._tipo; }
    get token() { return this._token; }
}
