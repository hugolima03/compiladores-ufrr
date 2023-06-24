import Padroes from './Padroes.mjs';
import Token from './Token.mjs';
import Lexema from './Lexema.mjs';
import ErroLexico from '../exception/ErroLexico.mjs'

export default class Lexico {

    constructor () {
        this._tokensReconhecidos = [];
    }

    _buscarTokenPelaLexema(lexema) {

        const classe = Padroes.descobrirTokenClasse(lexema);
        const subclasse = Padroes.descobrirTokenSubclasse(lexema, classe);

        let token = this._tokensReconhecidos.find(
            t => t.classe === classe && t.subclasse === subclasse
        );

        if(token !== undefined) return token;

        token = new Token(classe, subclasse);
        this._tokensReconhecidos.push(token);
        return token;
    }

    tokenizarLinha(entrada, linha) {

        const lexemasStr = Lexico._parsearLexemas(entrada);
        let coluna = 0;

        const lexemas = [];

        for (const l of lexemasStr) {
            if(!Padroes.ehEspaco(l)) {

                const token = this._buscarTokenPelaLexema(l);
                const lexema = new Lexema(l, linha, coluna, token);

                if (token === undefined || token.tipo === 'sem-categoria') {
                    throw ErroLexico(lexema);
                }

                lexemas.push(lexema);
            }
            coluna += l.length;
        }

        return lexemas;
    }

    get tokenizarHandle() {
        return (entrada, nLinha) => this.tokenizarLinha(entrada, nLinha);
    }

    static _parsearLexemas(entrada) {

        const separarPorStringLiterais = Lexico._separarPorStringLiterais(entrada);
        let lexemas = [];

        for (const spsl of separarPorStringLiterais) {

            if(Padroes.ehStringLiteral(spsl)){
                lexemas.push(spsl);
                continue;
            }

            const separarPorEspacos = Lexico._separarPorEspacos(spsl);
            for (const spe of separarPorEspacos) {

                if(Padroes.ehEspaco(spe)){
                    lexemas.push(spe);
                    continue;
                }

                lexemas = [
                    ...lexemas,
                    ...Lexico._separarPorOperadores(spe)
                ];
            }
        }

        return lexemas;
    }

    static _separarPorStringLiterais(entrada) {

        const stringRegex = new RegExp(Padroes.stringLiteral, 'g');
        const strs = [ ...entrada.matchAll(stringRegex) ];

        const fragmentos = [];
        let cursor = 0;
        for (const s of strs) {

            if (s['index'] - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index'] - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index'] + s[0].length;
        }

        if(cursor < entrada.length){
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }

    static _separarPorEspacos(entrada) {

        const strs = [ ...entrada.matchAll(Padroes.espacos) ];

        const fragmentos = [];
        let cursor = 0;

        for (const s of strs) {

            if (s['index'] - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index'] - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index'] + s[0].length;
        }

        if(cursor < entrada.length){
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }

    static _separarPorOperadores(entrada) {

        const operadores = [
            ...Padroes.opAritmeticos,
            ...Padroes.especiais
        ];

        const regex = new RegExp('\\' + operadores.join("|\\"), 'g');
        const strs = [ ...entrada.matchAll(regex) ];

        const fragmentos = [];
        let cursor = 0;

        for (const s of strs) {

            if (s['index'] - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index'] - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index'] + s[0].length;
        }

        if(cursor < entrada.length){
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }
}
