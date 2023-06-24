import SimboloIdentificador from './SimboloIdentificador';
import ErroSemantico from '../exception/ErroSemantico';
import Arvore from '../sintatico/Arvore';

export default class Semantico {
    _arvore: Arvore
    _tabelaDeSimbolos: SimboloIdentificador[]

    constructor(arvore: Arvore) {
        this._arvore = arvore;
        this._tabelaDeSimbolos = [];
    }

    get tabelaDeSimbolos() {
        return [...this._tabelaDeSimbolos];
    }

    _buscarSimbolo(nome: string) {
        return this._tabelaDeSimbolos.find(s => s.nome === nome);
    }

    _existeSimbolo(nome: string) {
        return this._buscarSimbolo(nome) !== undefined;
    }

    _buscarEValidarIdentificador(identificador: Arvore, tipo?: string) {
        const variavel = this._buscarSimbolo(identificador.extra.palavra);
        if (variavel === undefined) {
            throw ErroSemantico(identificador.extra, 'variavel-nao-declarada');
        }

        if (typeof (tipo) !== 'string') return variavel;
        if (variavel.tipo !== tipo) {
            throw ErroSemantico(identificador.extra, 'tipo-incompativel');
        }

        return variavel;
    }

    validar() {
        this.validarDeclaracoes();
        return this.validarComandos();
    }

    validarDeclaracoes() {

        const bloco = this._arvore.encontrarTodosNosPreOrdem('<bloco_declaracao>', 1);
        if (bloco.length === 0) return;

        const declaracoes = bloco[0].encontrarTodosNosPreOrdem('<declaracao>');
        for (const dec of declaracoes) {

            const id = dec.encontrarTodosNosPreOrdem('identificador', 1)[0];
            const tipo = dec.encontrarTodosNosPreOrdem('<declaracao_tipo>')[0].children[0];

            if (this._existeSimbolo(id.extra.palavra)) {
                throw ErroSemantico(id.extra, 'redeclaracao');
            }

            this._tabelaDeSimbolos.push(
                new SimboloIdentificador(
                    id.extra.palavra,
                    tipo.extra.palavra,
                    id.extra.token
                )
            );
        }
    }

    validarComandos() {

        if (this._tabelaDeSimbolos.length === 0) this.validarDeclaracoes();

        const bloco = this._arvore.encontrarTodosNosPreOrdem('<bloco_principal>', 1)[0];
        const comandos = bloco.encontrarTodosNosPreOrdem('<comando>');
        const arvores = [];

        for (const c of comandos) {
            switch (c.children[0].name) {
                case '<atribuicao>':
                    arvores.push(this._validarAtribuicao(c.children[0]));
                    break;
                case '<retorne_principal>':
                    arvores.push(this._validarRetornePrincipal(c.children[0]));
                    break;
                default:
                    throw ErroSemantico('', 'comando-invalido');
            }
        }

        const retorneComandos = arvores.filter(a => a.name === 'retorne');
        if (retorneComandos.length > 1) {
            throw ErroSemantico(retorneComandos.map(r => r.extra) as unknown as string, 'multiplos-retorne');
        }

        return arvores;
    }

    _validarAtribuicao(atribuicao: Arvore) {
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
        arvore.children = [esquerda, direita];

        return arvore;
    }

    _validarRetornePrincipal(retorne: Arvore) {

        const no = this._validarExpressao(
            retorne.encontrarTodosNosPreOrdem('<expressao>', 2)[0],
            'int'
        );

        const arvore = new Arvore(retorne.children[0].extra.palavra);
        arvore.extra = retorne.children[0].extra;
        arvore.children = [no];

        return arvore;
    }

    _validarExpressao(expressao: Arvore, tipo?: string): Arvore {
        const nos = expressao.children;

        if (nos[0].name === '<expressao>') {
            const atual = new Arvore(nos[1].extra.palavra);
            atual.extra = nos[1].extra;

            const esquerda = this._validarExpressao(nos[0], tipo);
            const direita = this._validarExpressaoTermo(nos[2], tipo);

            atual.children = [esquerda!, direita!];
            return atual;
        }

        if (nos[0].name === 'op-aritmetico-sub') {
            const atual = new Arvore(nos[0].extra.palavra);
            atual.extra = nos[0].extra;

            const filho = this._validarExpressaoTermo(nos[1], tipo);
            atual.children = [filho];

            return atual;
        }

        return this._validarExpressaoTermo(nos[0], tipo);
    }

    _validarExpressaoTermo(termo: Arvore, tipo?: string) {
        const nos = termo.children;

        if (nos[0].name === '<expressao_termo>') {
            const atual = new Arvore(nos[1].extra.palavra);
            atual.extra = nos[1].extra;

            const esquerda = this._validarExpressaoTermo(nos[0], tipo);
            const direita = this._validarExpressaoFator(nos[2], tipo);

            atual.children = [esquerda, direita];
            return atual;
        }

        return this._validarExpressaoFator(nos[0], tipo);
    }

    _validarExpressaoFator(fator: Arvore, tipo?: string) {
        const nos = fator.children;

        if (nos[0].name === 'identificador') {
            this._buscarEValidarIdentificador(nos[0], tipo);
            const atual = new Arvore(nos[0].extra.palavra);
            atual.extra = nos[0].extra;
            return atual;
        }

        if (nos[0].name === '<literal>') {

            const literal = nos[0];
            const atual = new Arvore(literal.children[0].extra.palavra);
            atual.extra = literal.children[0].extra;

            if (atual.extra.token.classe.split('-')[1] !== tipo) {
                throw ErroSemantico(atual.extra, 'tipo-incompativel');
            }

            return atual;
        }

        return this._validarExpressao(nos[1], tipo);
    }
}
