import ParametroInvalido from '../exception/ParametroInvalido'
import getType from '../getType'
import Token from './Token.mjs';

export default class Lexema {
    _palavra: string
    _linha: number
    _coluna: number
    _token: Token

    constructor(palavra: string, linha: number, coluna: number, token: Token) {

        if (getType(palavra) !== 'string') {
            throw ParametroInvalido('palavra', 'string', getType(palavra));
        }

        if (getType(linha) !== 'number') {
            throw ParametroInvalido('linha', 'number', getType(linha));
        }

        if (getType(coluna) !== 'number') {
            throw ParametroInvalido('coluna', 'number', getType(token));
        }

        if (getType(token) !== 'object' || token === null) {
            throw ParametroInvalido('token', 'Token', getType(token));
        }

        this._palavra = palavra;
        this._linha = parseInt(String(linha));
        this._coluna = parseInt(String(coluna));
        this._token = token;
        this._token.registrarLexema(this);
    }

    get palavra() { return this._palavra; }
    get linha() { return this._linha; }
    get coluna() { return this._coluna; }
    get token() { return this._token; }
}
