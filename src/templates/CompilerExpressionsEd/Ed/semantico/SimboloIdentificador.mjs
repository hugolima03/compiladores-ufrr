export default class SimboloIdentificador {

    constructor(nome, tipo, token) {
        this._nome = nome;
        this._tipo = tipo;
        this._token = token;
    }

    get nome() { return this._nome; }
    get tipo() { return this._tipo; }
    get token() { return this._token; }
}
