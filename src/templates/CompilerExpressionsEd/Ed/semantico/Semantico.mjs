import SimboloIdentificador from './SimboloIdentificador.mjs';
import ErroSemantico from '../exception/ErroSemantico.mjs';
import Arvore from '../sintatico/Arvore.mjs';

export default class Semantico {

    constructor(arvore) {
        this._arvore = arvore;
        this._tabelaDeSimbolos = [];
    }

    get tabelaDeSimbolos() { return [ ...this._tabelaDeSimbolos ]; }

    _buscarSimbolo(nome) {
        return this._tabelaDeSimbolos.find(s => s.nome === nome);
    }

    _existeSimbolo(nome) {
        return this._buscarSimbolo(nome) !== undefined;
    }

    _buscarEValidarIdentificador(identificador, tipo) {
        const variavel = this._buscarSimbolo(identificador.extra.palavra);
        if(variavel === undefined) {
            throw ErroSemantico(identificador.extra, 'variavel-nao-declarada');
        }

        if(typeof(tipo) !== 'string') return variavel;
        if(variavel.tipo !== tipo) {
            throw ErroSemantico(identificador.extra, 'tipo-incompativel');
        }

        return variavel;
    }

    validar() {
        this.validarDeclaracoes();
        return this.validarComandos();
    }

    validarDeclaracoes () {

        const bloco = this._arvore.encontrarTodosNosPreOrdem('<bloco_declaracao>', 1);
        if(bloco.length === 0) return;

        const declaracoes = bloco[0].encontrarTodosNosPreOrdem('<declaracao>');
        for (const dec of declaracoes) {

            const id = dec.encontrarTodosNosPreOrdem('identificador', 1)[0];
            const tipo = dec.encontrarTodosNosPreOrdem('<declaracao_tipo>')[0].nos[0];

            if(this._existeSimbolo(id.extra.palavra)) {
                throw ErroSemantico(id.extra, 'redeclaracao');
            }

            this._tabelaDeSimbolos.push (
                new SimboloIdentificador (
                    id.extra.palavra,
                    tipo.extra.palavra,
                    id.extra.token
                )
            );
        }
    }

    validarComandos () {

        if(this._tabelaDeSimbolos.length === 0) this.validarDeclaracoes();

        const bloco = this._arvore.encontrarTodosNosPreOrdem('<bloco_principal>', 1)[0];
        const comandos = bloco.encontrarTodosNosPreOrdem('<comando>');
        const arvores = [];

        for (const c of comandos) {
            switch (c.nos[0].simbolo) {
                case '<atribuicao>':
                    arvores.push(this._validarAtribuicao(c.nos[0]));
                break;
                case '<retorne_principal>':
                    arvores.push(this._validarRetornePrincipal(c.nos[0]));
                break;
                default:
                    throw ErroSemantico('', 'comando-invalido');
            }
        }

        const retorneComandos = arvores.filter(a => a.simbolo === 'retorne');
        if( retorneComandos.length > 1) {
            throw ErroSemantico(retorneComandos.map(r => r.extra), 'multiplos-retorne');
        }

        return arvores;
    }

    _validarAtribuicao(atribuicao) {

        const id = atribuicao.encontrarTodosNosPreOrdem('identificador', 1)[0];
        const variavel = this._buscarEValidarIdentificador(id);

        const esquerda = new Arvore(id.extra.palavra);
        esquerda.extra = id.extra;

        const atrOperador = atribuicao.encontrarTodosNosPreOrdem('especial-atr', 1)[0];

        const direita = this._validarExpressao(
            atribuicao.encontrarTodosNosPreOrdem('<expressao>', 2)[0],
            variavel.tipo
        );

        const arvore = new Arvore(atrOperador.extra.palavra);
        arvore.extra = atrOperador.extra;
        arvore._nos = [ esquerda, direita ];

        return arvore;
    }

    _validarRetornePrincipal(retorne) {

        const no = this._validarExpressao(
            retorne.encontrarTodosNosPreOrdem('<expressao>', 2)[0],
            'int'
        );

        const arvore = new Arvore(retorne.nos[0].extra.palavra);
        arvore.extra = retorne.nos[0].extra;
        arvore._nos = [ no ];

        return arvore;
    }

    _validarExpressao(expressao, tipo) {
        const nos = expressao.nos;

        if(nos[0].simbolo === '<expressao>'){
            const atual = new Arvore(nos[1].extra.palavra);
            atual.extra = nos[1].extra;

            const esquerda = this._validarExpressao(nos[0], tipo);
            const direita = this._validarExpressaoTermo(nos[2], tipo);

            atual._nos = [ esquerda, direita ];
            return atual;
        }

        if(nos[0].simbolo === 'op-aritmetico-sub'){
            const atual = new Arvore(nos[0].extra.palavra);
            atual.extra = nos[0].extra;

            const filho = this._validarExpressaoTermo(nos[1], tipo);
            atual._nos = [ filho ];

            return atual;
        }

        return this._validarExpressaoTermo(nos[0], tipo);
    }

    _validarExpressaoTermo (termo, tipo) {
        const nos = termo.nos;

        if(nos[0].simbolo === '<expressao_termo>'){
            const atual = new Arvore(nos[1].extra.palavra);
            atual.extra = nos[1].extra;

            const esquerda = this._validarExpressaoTermo(nos[0], tipo);
            const direita = this._validarExpressaoFator(nos[2], tipo);

            atual._nos = [ esquerda, direita ];
            return atual;
        }

        return this._validarExpressaoFator(nos[0], tipo);
    }

    _validarExpressaoFator (fator, tipo) {
        const nos = fator.nos;

        if(nos[0].simbolo === 'identificador'){
            this._buscarEValidarIdentificador(nos[0], tipo);
            const atual = new Arvore(nos[0].extra.palavra);
            atual.extra = nos[0].extra;
            return atual;
        }

        if(nos[0].simbolo === '<literal>'){

            const literal = nos[0];
            const atual = new Arvore(literal.nos[0].extra.palavra);
            atual.extra = literal.nos[0].extra;

            if(atual.extra.token.classe.split('-')[1] !== tipo){
                throw ErroSemantico(atual.extra, 'tipo-incompativel');
            }

            return atual;
        }

        return this._validarExpressao(nos[1], tipo);
    }
}
