import { patterns, isSpace, isStringLiteral, getTokenClass, getTokenSubClass } from '../utils/Patterns';
import Token from './Token';
import { Lexeme } from './Lexeme';
import ErroLexico from '../exception/ErroLexico'

export class LexicalAnalyser {
    _tokensReconhecidos: Token[]

    constructor() {
        this._tokensReconhecidos = [];
    }

    _buscarTokenPelaLexema(lexema: string) {
        const classe = getTokenClass(lexema);
        const subclasse = getTokenSubClass(lexema, classe!);

        let token = this._tokensReconhecidos.find(
            t => t.classe === classe && t.subclasse === subclasse
        );

        if (token !== undefined) return token;

        token = new Token(classe!, subclasse!);
        this._tokensReconhecidos.push(token);
        return token;
    }

    tokenizarLinha(entrada: string, linha: number) {
        // "    var: int;""
        const lexemasStr = LexicalAnalyser._parsearLexemas(entrada); // Popula a lista de strings de lexema
        // ["    ", "var", ":", " ", "int", ";"]

        let coluna = 0;
        const lexemas = [];

        // Criando as instâncias de Lexema a partir da lista de strings de lexema.
        for (const l of lexemasStr) {
            if (!isSpace(l)) { // Removendo espaços

                const token = this._buscarTokenPelaLexema(l); // Encontrando o token para o lexema
                const lexema = new Lexeme(l, linha, coluna, token);

                if (token === undefined || token.tipo === 'sem-categoria') {
                    throw ErroLexico(lexema);
                }

                lexemas.push(lexema);
            }
            coluna += l.length;
        }

        return lexemas;
    }

    static _parsearLexemas(entrada: string) { // "    var: int;""
        const separarPorStringLiterais = LexicalAnalyser._separarPorStringLiterais(entrada);

        let lexemas: string[] = [];

        for (const spsl of separarPorStringLiterais) {

            if (isStringLiteral(spsl)) {
                lexemas.push(spsl);
                continue;
            }

            const separarPorEspacos = LexicalAnalyser._separarPorEspacos(spsl);
            // ["    ", "var=0;"]
            for (const spe of separarPorEspacos) {

                if (isSpace(spe)) {
                    lexemas.push(spe);
                    continue;
                }

                lexemas = [
                    ...lexemas,
                    ...LexicalAnalyser._separarPorOperadores(spe) // ["    ", "var", "=", "0", ";"]
                ];
            }
        }
        return lexemas;
    }

    static _separarPorStringLiterais(entrada: string) {

        const stringRegex = new RegExp(patterns.stringLiteral, 'g');
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

        const strs = Array.from(entrada.matchAll(patterns.espacos));

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
            ...patterns.opAritmeticos,
            ...patterns.especiais
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
