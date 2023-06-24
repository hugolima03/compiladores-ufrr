export default class Production {
    _left: string
    _empty: string
    _right: string[]

    constructor(left: string, right: string, empty: string) {
        this._left = left;
        this._empty = empty;
        this._right = right.split(' ').filter(s => s.length > 0);
    }

    get left() { return this._left; }
    get right() { return [...this._right]; }
    get rightStr() { return this._right.join(' '); }

    get rightToString() {
        return [this.left, ' -> ', this.rightStr].join('');
    }
}
