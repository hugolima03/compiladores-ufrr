export class Production {
    _cabeca: string
    _vazio: string
    _corpo: string[]

    constructor(cabeca: string, corpo: string, vazio: string) {
        this._cabeca = cabeca;
        this._vazio = vazio;
        this._corpo = corpo.split(' ').filter(s => s.length > 0);
    }

    get cabeca() { return this._cabeca; }
    get corpo() { return [...this._corpo]; }
    get corpoStr() { return this._corpo.join(' '); }

    get comoString() {
        return [this.cabeca, ' -> ', this.corpoStr].join('');
    }
}
