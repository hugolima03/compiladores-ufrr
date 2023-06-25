import gramatica from './Regras.mjs'
import PrecedenciaFraca from './PrecedenciaFraca.mjs';
import Arvore from './Arvore.mjs';
import Lexico from '../lexico/Lexico.mjs';
import LexicoBuffer from '../lexico/LexicoBuffer.mjs';
import getType from '../getType.mjs';

export default class Sintatico {

    constructor() {
        this._lexico = new Lexico();
        this._analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    }

    parsearProducoes (entrada, handle) {
        if(getType(handle) !== 'function') handle = this._lexico.tokenizarHandle;
        return this._analisador.analisar(new LexicoBuffer(handle, '$', entrada));
    }

    parsear (entrada, proximaLexema) {

        let lexemas = [];
        const parsearLexemas = (e, l) => {
            const ls = this._lexico.tokenizarHandle(e, l);
            if(getType(proximaLexema) === 'function') ls.forEach(proximaLexema);
            lexemas = [ ...[...ls].reverse(), ...lexemas ];
            return ls;
        }

        const prods = this.parsearProducoes(entrada, parsearLexemas);

        const arvore = Arvore.parsearProducoes(prods, gramatica);
        arvore.posOrdem((n) => {
            if(!n.ehFolha) return;
            if(n.simbolo !== lexemas[0].token.tipo) return;
            n.extra = lexemas.shift();
        });

        return arvore;
    }
}
