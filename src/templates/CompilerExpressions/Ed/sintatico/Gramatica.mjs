import Producao from './Producao.mjs'

export default class Gramatica {

    constructor (producoes, vazio) {

        this._naoTerminais = Object.keys(producoes);
        this._vazio = vazio;
        this._producoes = {};

        let terminais = [];
        for (const snt of this._naoTerminais) {

            this._producoes[snt] = [];
            const prods = producoes[snt];
            for (const corpo of prods) {

                const p = new Producao(snt, corpo, this._vazio);
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

    producao (snt, indice) {

        if(typeof(indice) !== 'number') indice = 0;

        const producoes = this.buscarProducoesPorNaoTerminal(snt);
        if(indice < 0 || indice >= producoes.length) {
            throw new Error('Produção é inválida');
        }

        return producoes[indice];
    }

    get producoes() {
        let producoes = [];
        for (const snt of this._naoTerminais) {
            producoes = [
                ...producoes,
                ...this.buscarProducoesPorNaoTerminal(snt)
            ];
        }
        return producoes;
    }

    buscarProducoesPorNaoTerminal (snt) {
        if (typeof(this._producoes[snt]) === 'undefined') {
            throw new Error('O símbolo não terminai não foi definido')
        }
        return this._producoes[snt];
    }

    simboloEhNaoTerminal(simbolo) {
        return this._naoTerminais.includes(simbolo);
    }

    simboloEhVazio(simbolo) {
        return this._vazio === simbolo;
    }
}
