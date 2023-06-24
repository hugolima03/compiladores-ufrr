import gramatica from './Regras'
import PrecedenciaFraca from './PrecedenciaFraca';
import Arvore from './Arvore';
import Lexico from '../lexico/Lexico';
import LexicoBuffer from '../lexico/LexicoBuffer';
import getType from '../getType';
import Lexema from '../lexico/Lexema';

export default class Sintatico {
    _lexico: Lexico
    _analisador: PrecedenciaFraca

    constructor() {
        this._lexico = new Lexico();
        this._analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    }

    parsearProducoes(entrada: string, handle: any) {
        if (getType(handle) !== 'function') handle = this._lexico.tokenizarHandle;
        return this._analisador.analisar(new LexicoBuffer(handle, '$', entrada));
    }

    parsear(entrada: string) {

        let lexemas: Lexema[] = [];
        const parsearLexemas = (e: string, l: number) => {
            const ls = this._lexico.tokenizarHandle(e, l);
            // if (getType(proximaLexema) === 'function') ls.forEach(proximaLexema);
            lexemas = [...[...ls].reverse(), ...lexemas];
            return ls;
        }

        const prods = this.parsearProducoes(entrada, parsearLexemas);

        const arvore = Arvore.parsearProducoes(prods, gramatica);
        arvore?.posOrdem((n) => {
            if (!n.ehFolha) return;
            if (n.name !== lexemas[0].token.tipo) return;
            n.extra = lexemas.shift();
        });

        return arvore;
    }
}
