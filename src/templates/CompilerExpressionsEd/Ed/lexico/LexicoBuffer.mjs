import Padroes from './Padroes.mjs';
import ParametroInvalido from '../exception/ParametroInvalido.mjs';
import getType from '../getType.mjs';

export default class LexicoBuffer {

    constructor (handle, eof, entrada) {

        if(getType(handle) !== 'function') {
            throw ParametroInvalido('handle', 'function', getType(handle));
        }

        if(getType(eof) !== 'string') {
            throw ParametroInvalido('eof', 'string', getType(eof));
        }

        if(getType(entrada) === 'string') {
            entrada = entrada.split(Padroes.EOL);
        }

        if(getType(entrada) !== 'object' || entrada === null) {
            throw ParametroInvalido('entrada', 'Array ou string', getType(entrada));
        }

        this._handle = handle;
        this._linhas = entrada;
        this._linhaAtual = 0;
        this._buffer = [];
        this._eof = eof;
    }

    get proximo () {

        while(this._buffer.length === 0) {

            if(this._linhas.length === 0) return this._eof;

            this._buffer = this._handle(
                this._linhas.shift(),
                this._linhaAtual++
            );
        }

        return this._buffer.shift();
    }

}
