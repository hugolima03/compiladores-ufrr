/**
 * Classe responsável por genrenciar a derivação conforme vai sendo aplicado as
 * produções de uma gramática
 */
export default class Derivacao {

    /**
     * Construtor da classe
     * @param {string} entrada  String de entrada para que será utilizada como
     *                          base para as derivações
     * @param {Gramatica} gramatica Instância de uma gramática
     */
    constructor(entrada, gramatica) {

        if (typeof (entrada) !== 'string' || entrada.length === 0) {
            throw 'A entrada deve ser uma string não vazia'
        }

        if (typeof (gramatica) !== 'object') {
            throw 'Deve uma instância Gramática'
        }

        this._gerado = entrada;
        this._gramatica = gramatica;
    }

    /**
     * Aplica uma produção na string de geração
     * @param  {string} snt     Símbolo não terminal da produção
     * @param  {integer} indice  Índice para a produção do símbolo não terminal
     * @param  {integer|string} posicao Posição ou lado que será aplicado a prpdução,
     *                                  pode ser um índice vádio da cabeça da produção,
     *                                  ou esqueda, ou direita
     * @return {[string}
     */
    _aplicarProducao(snt, indice, posicao) {

        // Busca pelas produções do símbolo não terminal
        const prod = this._gramatica.producao(snt, indice);

        // Se a posicao for um número, apenas aplica a produção com esta posição
        if (typeof (posicao) === 'number') {
            return prod.aplicar(this._gerado, posicao);
        }

        // Se não for uma string, define para aplicar pela esquerda, se for uma
        // string, converte toda para minusculo
        if (typeof (posicao) !== 'string') posicao = 'e';
        else posicao = posicao.toLowerCase();

        // Verifica se foi definido para aplicar pela direita
        if (['d', 'dir', 'direita', 'r', 'right'].includes(posicao)) {
            return prod.applyByRight(this._gerado);
        }

        // Se não aplica pela esquerca
        return prod.applyByLeft(this._gerado);
    }

    /**
     * Realiza a proxima produção da derivação
     * @param  {string} snt     Símbolo não terminal da produção
     * @param  {integer} indice  Índice para a produção do símbolo não terminal
     * @param  {integer|string} posicao Posição ou lado que será aplicado a prpdução,
     *                                  pode ser um índice vádio da cabeça da produção,
     *                                  ou esqueda, ou direita
     * @return {Derivacao}
     */
    proximo(snt, indice, posicao) {

        // Se não existir mais símbolos terminais, não faz mais nada
        if (!this._gramatica.existeNaoTerminal(this._gerado)) return this;

        // Se ainda existir, aplica a proxima produção
        this._gerado = this._aplicarProducao(snt, indice, posicao);

        // Retorna o mesmo objeto, para continuar as produções
        return this;
    }

    /**
     * Retorna a string gerada até então
     * @return {string}
     */
    get gerado() { return this._gerado; }
}
