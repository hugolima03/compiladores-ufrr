import Padroes from '../lexico/Padroes.mjs'
import Instrucao from './Instrucao.mjs'

export default class Mips {

    constructor(tabelaDeSimbolos) {
        this._tabeladeVariaveis = tabelaDeSimbolos;
        this._texto = [];

        const registradoresTeporarios = Array(10).fill().map((_, i) => '$t'+i)
        this._registradoresTeporarios = {};
        for (const r of registradoresTeporarios) {
            this._registradoresTeporarios[r] = null;
        }
    }

    get blocoDados() {

        const bloco = [];
        for (const variavel of this._tabeladeVariaveis) {
            bloco.push({
                nome: this._codificarNomeVariavel(variavel.nome),
                diretiva: 'word',
                valor: '0'
            });
        }

        return bloco;
    }

    get blocoTexto() { return [... this._texto ]; }

    adicionarInstrucoes(instrucoes) {

        instrucoes = [...instrucoes];

        while(instrucoes.length > 0) {
            const inst = instrucoes.shift();

            const args = this._parsearArgumentos(inst.argumentos);
            this._liberarRegistradoresSemUso(instrucoes);

            if(inst.operador !== 'retorne') {

                const operando = this._parsearOperando(inst.operando);

                if(this._ehOpAritmetico(inst.operador)) {
                    this._codificarOperacaoAritmetica (
                        inst.operador,
                        operando,
                        args
                    );
                }

                if(this._ehVariavel(inst.operando)) {
                    this._texto.push(
                        new Instrucao(
                            'sw',
                            operando,
                            [ this._codificarNomeVariavel(inst.operando) ]
                        )
                    );
                }
            }
            else {
                this._texto.push(new Instrucao('addi', '$v0', ['$zero', '17']));
                this._texto.push(new Instrucao('add', '$a0', ['$zero', args[0]]));
                this._texto.push(new Instrucao('syscall', ''));
            }

            this._liberarRegistradoresSemUso(instrucoes);
        }

    }

    _codificarOperacaoAritmetica(operador, operando, argumentos) {

        switch (operador) {

            case '+':
                this._texto.push(new Instrucao('add', operando, argumentos));
            break;

            case '-':
                if(argumentos.length !== 1) {
                    this._texto.push(new Instrucao('sub', operando, argumentos));
                }
                else {
                    this._texto.push(
                        new Instrucao('sub', operando, ['$zero', argumentos[0]])
                    );
                }
            break;

            case '*':
                this._texto.push(
                    new Instrucao('mult', argumentos[0], [ argumentos[1] ])
                );
                this._texto.push(new Instrucao('mflo', operando));
            break;

            case '/':
                this._texto.push(
                    new Instrucao('div', argumentos[0], [ argumentos[1] ])
                );
                this._texto.push(new Instrucao('mflo', operando));
            break;

            case '%':
                this._texto.push(
                    new Instrucao('div', argumentos[0], [ argumentos[1] ])
                );
                this._texto.push(new Instrucao('mfhi', operando));
            break;
        }
    }

    _parsearOperando(simbolo) {
        let registrador = this._econtrarRegistradorComValor(simbolo);

        if(registrador === null) {
            registrador = this._buscaRegistradorVazio();
            this._defineValorParaRegistrador(simbolo, registrador);
        }

        return registrador;
    }

    _parsearArgumentos(argumentos) {

        return argumentos.map(arg => {

            let registrador = this._econtrarRegistradorComValor(arg);

            if(registrador === null) registrador = this._buscaRegistradorVazio();
            else return registrador;

            if(this._ehVariavel(arg)) {
                this._texto.push(
                    new Instrucao(
                        'lw',
                        registrador,
                        [this._codificarNomeVariavel(arg)]
                    )
                );
            }
            else if (!this._ehTemporario(arg)) {
                this._texto.push(
                    new Instrucao(
                        'addi',
                        registrador,
                        ['$zero', arg]
                    )
                );
            }

            this._defineValorParaRegistrador(arg, registrador);
            return registrador;
        });
    }

    _codificarNomeVariavel(simbolo) {
        const variavel = this._tabeladeVariaveis.find(v => v.nome === simbolo);
        if (variavel === undefined) return null;
        return ['id', variavel.tipo, variavel.nome].join('_') ;
    }

    _ehVariavel(simbolo) {
        return this._codificarNomeVariavel(simbolo) !== null;
    }

    _ehTemporario(simbolo) { return Padroes.matchExact(simbolo, /^<\d+>$/); }

    _ehOpAritmetico (simbolo) {
        return ['+', '-', '*', '/', '%'].includes(simbolo);
    }

    _liberarRegistradoresSemUso(instrucoes) {

        if(instrucoes.length === 0) {
            this._resetarRegistradores();
            return;
        }

        const nomes = Object.keys(this._registradoresTeporarios);
        const comValorDefinido = [];
        for (const reg of nomes) {
            if(this._registradoresTeporarios[reg] === null) continue;
            comValorDefinido.push(reg);
        }

        for (const reg of comValorDefinido) {
            const valor = this._registradoresTeporarios[reg];

            let ehReutilizado = false;
            for (const inst of instrucoes) {
                if(inst.argumentos.includes(valor)){
                    ehReutilizado = true;
                    break;
                }
            }
            if(!ehReutilizado) this._defineValorParaRegistrador(null, reg);
        }
    }

    _resetarRegistradores () {
        const nomes = Object.keys(this._registradoresTeporarios);
        for (const reg of nomes) this._registradoresTeporarios[reg] = null;
    }

    _defineValorParaRegistrador(valor, registrador) {
        if(typeof(this._registradoresTeporarios[registrador]) !== 'undefined') {
            this._registradoresTeporarios[registrador] = valor;
        }
    }

    _buscaRegistradorVazio() {
        const nomes = Object.keys(this._registradoresTeporarios);
        for (const reg of nomes) {
            if(this._registradoresTeporarios[reg] !== null) continue;
            return reg
        }
        throw 'Sem registradores disponiveis';
    }

    _econtrarRegistradorComValor(valor) {
        const nomes = Object.keys(this._registradoresTeporarios);
        for (const reg of nomes) {
            if(this._registradoresTeporarios[reg] !== valor) continue;
            return reg
        }
        return null;
    }
}
