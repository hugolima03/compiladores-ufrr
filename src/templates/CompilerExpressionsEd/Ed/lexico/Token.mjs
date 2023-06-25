import ParametroInvalido from '../exception/ParametroInvalido.mjs'
import getType from '../getType.mjs'

export default class Token {

    constructor (classe, subclasse) {

        if (getType(classe) !== 'string') {
            throw ParametroInvalido('classe', 'string', getType(classe));
        }

        if (getType(subclasse) !== 'string') {
            throw ParametroInvalido('subclasse', 'string', getType(subclasse));
        }

        this._classe = classe;
        this._subclasse = subclasse;
        this._lexemas = [];
    }

    get classe() { return this._classe; }
    get subclasse() { return this._subclasse; }

    get tipo() {
        return this._classe + (this._subclasse !== '' ? '-' + this._subclasse : '');
    }

    get lexemas() { return [ ...this._lexemas ]; }

    registrarLexema(lexema) {
        if(getType(lexema) !== 'object') {
            throw ParametroInvalido('lexema', 'Lexema', getType(lexema));
        }

        if(!this._lexemas.includes(lexema)) this._lexemas.push(lexema);
    }
}
