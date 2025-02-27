import { Production } from './Production'

export class Grammar {
    _terminais: string[]
    _naoTerminais: string[]
    _vazio: string
    _producoes: { [key: string]: Production[] }

    constructor(producoes: { [key: string]: string[] }, vazio: string) {
        this._naoTerminais = Object.keys(producoes);
        this._vazio = vazio;
        this._producoes = {};

        let terminais: string[] = [];
        for (const snt of this._naoTerminais) {

            this._producoes[snt] = [];
            const prods = producoes[snt];
            for (const corpo of prods) {

                const p = new Production(snt, corpo, this._vazio);
                this._producoes[snt].push(p);

                terminais = [
                    ...terminais,
                    ...p.corpo.filter(s => !this._naoTerminais.includes(s))
                ];
            }
        }

        this._terminais = terminais.filter((i, p) => terminais.indexOf(i) === p);
    }

    get vazio() { return this._vazio; }

    producao(snt: string, indice: number) {

        if (typeof (indice) !== 'number') indice = 0;

        const producoes = this.buscarProducoesPorNaoTerminal(snt);
        if (indice < 0 || indice >= producoes.length) {
            throw new Error('Produção é inválida');
        }

        return producoes[indice];
    }

    get producoes() {
        let producoes: Production[] = [];
        for (const snt of this._naoTerminais) {
            producoes = [
                ...producoes,
                ...this.buscarProducoesPorNaoTerminal(snt)
            ];
        }
        return producoes;
    }

    buscarProducoesPorNaoTerminal(snt: string) {
        if (typeof (this._producoes[snt]) === 'undefined') {
            throw new Error('O símbolo não terminai não foi definido')
        }
        return this._producoes[snt];
    }

    isNonTerminalSymbol(simbolo: string) {
        return this._naoTerminais.includes(simbolo);
    }

    isEmptySymbol(simbolo: string) {
        return this._vazio === simbolo;
    }
}
