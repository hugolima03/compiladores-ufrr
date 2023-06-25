import Padroes, { ehEspaco, ehStringLiteral, descobrirTokenClasse, descobrirTokenSubclasse } from './Padroes';
import Token from './Token';
import Lexema from './Lexema';
import ErroLexico from '../exception/ErroLexico'

export default class Lexico {
    _tokensReconhecidos: Token[]

    constructor() {
        this._tokensReconhecidos = [];
    }

    _buscarTokenPelaLexema(lexema: string) {

        const classe = descobrirTokenClasse(lexema);
        const subclasse = descobrirTokenSubclasse(lexema, classe!);

        let token = this._tokensReconhecidos.find(
            t => t.classe === classe && t.subclasse === subclasse
        );

        if (token !== undefined) return token;

        token = new Token(classe, subclasse);
        this._tokensReconhecidos.push(token);
        return token;
    }

    tokenizarLinha(entrada: string, linha: number) {

        const lexemasStr = Lexico._parsearLexemas(entrada);
        let coluna = 0;

        const lexemas = [];

        for (const l of lexemasStr) {
            if (!ehEspaco(l)) {

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
        return (entrada: string, nLinha: number) => this.tokenizarLinha(entrada, nLinha);
    }

    static _parsearLexemas(entrada: string) {

        const separarPorStringLiterais = Lexico._separarPorStringLiterais(entrada);
        let lexemas: string[] = [];

        for (const spsl of separarPorStringLiterais) {

            if (ehStringLiteral(spsl)) {
                lexemas.push(spsl);
                continue;
            }

            const separarPorEspacos = Lexico._separarPorEspacos(spsl);
            for (const spe of separarPorEspacos) {

                if (ehEspaco(spe)) {
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

    static _separarPorStringLiterais(entrada: string) {

        const stringRegex = new RegExp(Padroes.stringLiteral, 'g');
        const strs = Array.from(entrada.matchAll(stringRegex));


        const fragmentos = [];
        let cursor = 0;
        for (const s of strs) {

            if (s['index']! - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index']! - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index']! + s[0].length;
        }

        if (cursor < entrada.length) {
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }

    static _separarPorEspacos(entrada: string) {

        const strs = Array.from(entrada.matchAll(Padroes.espacos));

        const fragmentos = [];
        let cursor = 0;

        for (const s of strs) {
            if (s['index']! - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index']! - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index']! + s[0].length;
        }

        if (cursor < entrada.length) {
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }

    static _separarPorOperadores(entrada: string) {

        const operadores = [
            ...Padroes.opAritmeticos,
            ...Padroes.especiais
        ];

        const regex = new RegExp('\\' + operadores.join("|\\"), 'g');
        const strs = Array.from(entrada.matchAll(regex));

        const fragmentos = [];
        let cursor = 0;

        for (const s of strs) {

            if (s['index']! - cursor > 0) {
                fragmentos.push(entrada.substr(cursor, s['index']! - cursor));
            }

            fragmentos.push(s[0]);
            cursor = s['index']! + s[0].length;
        }

        if (cursor < entrada.length) {
            fragmentos.push(entrada.substr(cursor));
        }

        return fragmentos;
    }
}
