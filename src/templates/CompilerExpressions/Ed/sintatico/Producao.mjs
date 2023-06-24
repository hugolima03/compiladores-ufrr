export default class Producao {

    constructor(cabeca, corpo, vazio) {
        this._cabeca = cabeca;
        this._vazio = vazio;
        this._corpo = corpo.split(' ').filter(s => s.length > 0);
    }

    get cabeca() { return this._cabeca; }
    get corpo() { return [ ...this._corpo ]; }
    get corpoStr() { return this._corpo.join(' '); }

    get comoString() {
        return [ this.cabeca, ' -> ', this.corpoStr ].join('');
    }
}
