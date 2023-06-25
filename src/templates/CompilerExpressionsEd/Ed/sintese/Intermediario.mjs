import Instrucao from './Instrucao.mjs';
import Padroes from '../lexico/Padroes.mjs'

export default class Intermediario {

    constructor(comandos) {
        this._temp = 0;
        this._comandos = this._parsearComandos(comandos);
    }

    get comandos() {
        const comandos = [];
        for (const com of this._comandos) comandos.push(com.map(c => c.copiar()))
        return comandos;
    }
    get totalComandos() { return this._comandos.length; }

    optimizar() {
        const otimizados = [];
        const comandos = this.comandos;
        for (const c of comandos) {
            let otimizado = this._otimizarAtribuicoes(c);
            otimizados.push(this._otimizarComPropriedadesAlgebricas(otimizado));
        }

        return otimizados;
    }

    _parsearComandos(comandos) {
        const gerados = [];

        for (const c of comandos) {
            gerados.push(this._parsearComando(c));
        }

        return gerados;
    }

    _parsearComando(comando) {
        switch (comando.simbolo) {
            case '=': return this._parsearAtribuicao(comando); break;
            case 'retorne': return this._parsearRetorne(comando); break;
        }
    }

    _parsearAtribuicao(atribuicao) {
        this._resetarTemporario();

        const instrucoes = this._parsearExpressao(atribuicao.nos[1]);
        return [
            new Instrucao(
                '=',
                atribuicao.nos[0].simbolo,
                [ instrucoes[0].operando ]
            ),
            ...instrucoes
        ].reverse();
    }

    _parsearRetorne(retorne) {
        this._resetarTemporario();

        const instrucoes = this._parsearExpressao(retorne.nos[0]);
        return [
            new Instrucao(
                'retorne',
                retorne.simbolo,
                [ instrucoes[0].operando ]
            ),
            ...instrucoes
        ].reverse();
    }

    _parsearExpressao(expressao) {

        const token = expressao.extra.token;
        const nos = expressao.nos;

        switch (token.tipo) {
            case 'literal-int':
            case 'identificador':
                return [
                    new Instrucao(
                        '=',
                        this._gerarTemporario(),
                        [ expressao.simbolo ]
                    )
                ];
            break;

            case 'op-aritmetico-sub':
                if(nos.length === 1) {
                    const filho = this._parsearExpressao(nos[0]);
                    return [
                        new Instrucao(
                            expressao.simbolo,
                            this._gerarTemporario(),
                            [ filho[0].operando ]
                        ),
                        ...filho
                    ]
                }
            case 'op-aritmetico-adi':
            case 'op-aritmetico-mul':
            case 'op-aritmetico-div':
            case 'op-aritmetico-mod':

                const dir = this._parsearExpressao(nos[1]);
                const esq = this._parsearExpressao(nos[0]);

                return [
                    new Instrucao(
                        expressao.simbolo,
                        this._gerarTemporario(),
                        [
                            esq[0].operando,
                            dir[0].operando
                        ]
                    ),
                    ...esq,
                    ...dir
                ];
            break;
        }
    }

    _otimizarAtribuicoes (instrucoes) {

        const atribuicoesTempValor = [];
        const atribuicoesValorTemp = [];

        for (const inst of instrucoes) {
            if(inst.operador !== '=') continue;
            if(inst.totalArgs !== 1) continue;
            if(!this._ehTemporario(inst.operando)) continue;
            atribuicoesTempValor.push(inst);
        }

        for (const a of atribuicoesTempValor) {
            for (const inst of instrucoes) {
                if(a === inst) continue;
                while(inst._argumentos.includes(a.operando)){
                    const indice = inst._argumentos.indexOf(a.operando);
                    inst._argumentos[indice] = a.argumento(0);
                }
            }
        }

        for (const inst of instrucoes) {
            if(inst.operador !== '=') continue;
            if(inst.totalArgs !== 1) continue;
            if(this._ehTemporario(inst.operando)) continue;
            if(!this._ehTemporario(inst.argumento(0))) continue;
            atribuicoesValorTemp.push(inst);
        }

        for (const a of atribuicoesValorTemp) {
            for (const inst of instrucoes) {
                if(a === inst) continue;
                if(inst.operando !== a.argumento(0)) continue;
                inst._operando = a.operando;
            }
        }

        return this._ajustarTemporarios(
            instrucoes.filter(i => {
                return !(
                    atribuicoesTempValor.includes(i) ||
                    atribuicoesValorTemp.includes(i)
                );
            })
        );
    }

    _otimizarComPropriedadesAlgebricas (instrucoes) {
        for (const inst of instrucoes) {
            if(inst.operador === 'retorne') continue;
            if(inst.operador === '=') continue;

            const args = inst.argumentos;
            switch (inst.operador) {
                case '+':
                    if(parseInt(args[0]) === 0 && parseInt(args[1]) === 0){
                        inst._operador = '=';
                        inst._argumentos = [ '0' ];
                    }
                    else if(parseInt(args[0]) !== 0 && parseInt(args[1]) === 0) {
                        inst._operador = '=';
                        inst._argumentos = [ args[0] ];
                    }
                    else if(parseInt(args[0]) === 0 && parseInt(args[1]) !== 0) {
                        inst._operador = '=';
                        inst._argumentos = [ args[1] ];
                    }
                break;
                case '-':
                    if(parseInt(args[0]) === 0 && parseInt(args[1]) === 0){
                        inst._operador = '=';
                        inst._argumentos = [ '0' ];
                    }
                    else if(parseInt(args[0]) !== 0 && parseInt(args[1]) === 0) {
                        inst._operador = '=';
                        inst._argumentos = [ args[0] ];
                    }
                break;
                case '*':
                    if(parseInt(args[0]) === 1 && parseInt(args[1]) === 1){
                        inst._operador = '=';
                        inst._argumentos = [ '1' ];
                    }
                    else if(parseInt(args[0]) !== 0 && parseInt(args[1]) === 1) {
                        inst._operador = '=';
                        inst._argumentos = [ args[0] ];
                    }
                    else if(parseInt(args[0]) === 1 && parseInt(args[1]) !== 1) {
                        inst._operador = '=';
                        inst._argumentos = [ args[1] ];
                    }
                break;
                case '/':
                    if(parseInt(args[0]) === 1 && parseInt(args[1]) === 1){
                        inst._operador = '=';
                        inst._argumentos = [ '1' ];
                    }
                    else if(parseInt(args[0]) !== 1 && parseInt(args[1]) === 1) {
                        inst._operador = '=';
                        inst._argumentos = [ args[0] ];
                    }
                break;
                case '%':
                    if(parseInt(args[0]) === 1 && parseInt(args[1]) === 1){
                        inst._operador = '=';
                        inst._argumentos = [ '0' ];
                    }
                    else if(parseInt(args[0]) !== 1 && parseInt(args[1]) === 1) {
                        inst._operador = '=';
                        inst._argumentos = [ '0' ];
                    }
                break;
            }
        }

        return instrucoes;
    }

    _ajustarTemporarios(instrucoes) {
        let temp = [];

        for (const i of instrucoes) {
            if(this._ehTemporario(i.operando)) temp.push(i.operando);
            for (const a of i.argumentos) {
                if(this._ehTemporario(a)) temp.push(a);
            }
        }

        temp = temp.filter((i, p) => temp.indexOf(i) === p);
        this._resetarTemporario();

        for (const t of temp) {
            const novoTemp = this._gerarTemporario();
            for (const i of instrucoes) {
                if(i.operando === t) i._operando = novoTemp;
                i._argumentos = i._argumentos.map(a => a === t ? novoTemp : a);
            }
        }

        return instrucoes;
    }

    _ehTemporario(simbolo) { return Padroes.matchExact(simbolo, /^<\d+>$/); }
    _resetarTemporario() { this._temp = 0; }
    _gerarTemporario() { return ['<', this._temp++, '>'].join(''); }
}
