/**
 * Classe responsável por representar uma produção em uma gramática
 */
export default class Producao {

    /**
     * Construtor da classe
     * @param {string} cabeca Símbolo não terminal que corresponde a cabeça da produção
     * @param {[string]} corpo  Lista de símbolos que correspondem ao corpo da produção
     * @param {string} vazio  Símbolo que representa o vazio na gramática
     */
    constructor(cabeca, corpo, vazio) {

        if(typeof(cabeca) !== 'string' || cabeca.length === 0) {
            throw 'A cabeça da produção deve ser uma string não vazia';
        }

        if(typeof(corpo) !== 'object' || !(corpo instanceof Array)) {
            throw 'O corpo da produção deve ser uma lista de strings'
        }

        if(corpo.length === 0 || !corpo.every(i => typeof(i) === 'string')) {
            throw 'O corpo da produção deve ser uma lista de strings não vazia';
        }

        if(typeof(vazio) !== 'string' || vazio.length !== 1) {
            throw 'O símbolo vazio deve ser uma string não vazia de tamanho 1';
        }

        this._cabeca = cabeca;
        this._corpo = corpo;
        this._vazio = vazio;
    }

    /**
     * Retorna o símbolo da cabeça
     * @return {string}
     */
    get cabeca() { return this._cabeca; }

    /**
     * Retorna a lista de símbolos do corpo
     * @return {[string]}
     */
    get corpo() { return [ ...this._corpo ]; }

    /**
     * Retorna os símbolos da string concatenados em uma única string
     * @return {string}
     */
    get corpoStr() { return this._corpo.join(''); }

    /**
     * Retorna a string completa da produção no formato A -> B
     * @return {string}
     */
    get comoString() {
        return [ this.cabeca, ' -> ', this.corpoStr ].join('');
    }

    /**
     * Aplica a produção na string de entrada pela esquerda na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     * @param  {string} entrada String de entrada para produção
     * @return {strng}
     */
    aplicarPelaEsquerda (entrada) {
        return this.aplicar(entrada, entrada.indexOf(this.cabeca));
    }

    /**
     * Aplica a produção na string de entrada pela direita na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     * @param  {string} entrada String de entrada para produção
     * @return {strng}
     */
    aplicarPelaDireita (entrada) {
        return this.aplicar(entrada, entrada.lastIndexOf(this.cabeca));
    }

    /**
     * Aplica a produção na string de entrada em uma posição válida que corresponde
     * ao símbolo da cabeça, caso a posição não seja válida, apenas retorna a
     * string de entrada
     * @param  {string} entrada String de entrada para produção
     * @param  {integer} posicao Posição válida correspondente ao símbolo da cabeça
     * @return {string}
     */
    aplicar(entrada, posicao) {
        if(posicao < 0 || posicao >= entrada.length) return entrada;
        if(entrada.substr(posicao, this.cabeca.length) !== this.cabeca) return entrada;
        return this._aplicar(entrada, posicao);
    }

    /**
     * Aplica a produção em uma posição qualquer na string de entrada
     * @param  {string} entrada String de entrada para produção
     * @param  {integer} posicao Posição em que será aplicada a produção
     * @return {string}
     */
    _aplicar(entrada, posicao) {
        entrada = [ ...entrada ];
        return [
            ...entrada.slice(0, posicao),
            ...this.corpo.filter(s => s !== this._vazio),
            ...entrada.slice(posicao + this.cabeca.length),
        ].join('');
    }
}
