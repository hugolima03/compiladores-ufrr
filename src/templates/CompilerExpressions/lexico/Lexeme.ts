import Token from "./Token";

export class Lexeme {
    _palavra: string;
    _linha: number;
    _coluna: number;
    _token: Token;

    constructor(palavra: string, linha: number, coluna: number, token: Token) {
        this._palavra = palavra;
        this._linha = parseInt(String(linha));
        this._coluna = parseInt(String(coluna));
        this._token = token;
        this._token.registrarLexema(this);
    }

    get palavra() {
        return this._palavra;
    }
    get linha() {
        return this._linha;
    }
    get coluna() {
        return this._coluna;
    }
    get token() {
        return this._token;
    }
}
