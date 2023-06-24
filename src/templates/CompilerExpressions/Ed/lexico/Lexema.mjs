import ParametroInvalido from '../exception/ParametroInvalido.mjs'
import getType from '../getType.mjs'

export default class Lexema {

    constructor (palavra, linha, coluna, token) {

        if (getType(palavra) !== 'string') {
            throw ParametroInvalido('palavra', 'string', getType(palavra));
        }

        if (getType(linha) !== 'number') {
            throw ParametroInvalido('linha', 'number', getType(linha));
        }

        if (getType(coluna) !== 'number') {
            throw ParametroInvalido('coluna', 'number', getType(token));
        }

        if(getType(token) !== 'object' || token === null) {
            throw ParametroInvalido('token', 'Token', getType(token));
        }

        this._palavra = palavra;
        this._linha = parseInt(linha);
        this._coluna = parseInt(coluna);
        this._token = token;
        this._token.registrarLexema(this);
    }

    get palavra() { return this._palavra; }
    get linha() { return this._linha; }
    get coluna() { return this._coluna; }
    get token() { return this._token; }
}
