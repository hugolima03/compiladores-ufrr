import Instruction from "./Instruction";

import { matchExact } from "../utils/Patterns";

import { Tree } from "../pipeline1/Tree";

type TokenType =
  | "literal-int"
  | "identificador"
  | "op-aritmetico-sub"
  | "op-aritmetico-adi"
  | "op-aritmetico-mul"
  | "op-aritmetico-div"
  | "op-aritmetico-mod";

export default class Intermediario {
  _temp: number;
  _comandos: Instruction[][];

  constructor(comandos: Tree[]) {
    this._temp = 0;

    const gerados: Instruction[][] = [];

    for (const c of comandos) {
      gerados.push(this._parsearComando(c)!);
    }

    this._comandos = gerados;
  }

  get comandos() {
    const comandos = [];
    for (const com of this._comandos) comandos.push(com.map((c) => c.copy()));
    return comandos;
  }

  get totalComandos() {
    return this._comandos.length;
  }

  optimize() {
    const otimizados = [];
    const comandos = this.comandos;
    for (const c of comandos) {
      let otimizado = this._optimizeAssignments(c);
      otimizados.push(this._optimizeWithAlgebraicProperties(otimizado));
    }

    return otimizados;
  }

  _parsearComando(comando: Tree) {
    switch (comando.simbolo) {
      case "=":
        return this._parsearAtribuicao(comando);
        break;
      case "retorne":
        return this._parsearRetorne(comando);
        break;
    }
  }

  _parsearAtribuicao(atribuicao: Tree) {
    this._resetTempVar();
    const instrucoes = this._parseExpression(atribuicao.nos[1]);

    return [
      new Instruction(
        "=",
        atribuicao.nos[0].simbolo, // var
        [instrucoes[0].operand]
      ), // 10
      ...instrucoes,
    ].reverse();
  }

  _parsearRetorne(retorne: Tree) {
    this._resetTempVar();

    const instrucoes = this._parseExpression(retorne.nos[0]);
    return [
      new Instruction("retorne", retorne.simbolo, [instrucoes[0].operand]),
      ...instrucoes,
    ].reverse();
  }

  _parseExpression(expressao: Tree): Instruction[] {
    const token = expressao.extra!.token;
    const nos = expressao.nos;

    switch (token.tipo as TokenType) {
      case "literal-int":
      case "identificador":
        return [
          new Instruction("=", this._generateTempVar(), [expressao.simbolo]),
        ];
        break;

      case "op-aritmetico-sub":
        if (nos.length === 1) {
          const filho = this._parseExpression(nos[0]);
          return [
            new Instruction(expressao.simbolo, this._generateTempVar(), [
              filho[0].operand,
            ]),
            ...filho,
          ];
        }
      case "op-aritmetico-adi":
      case "op-aritmetico-mul":
      case "op-aritmetico-div":
      case "op-aritmetico-mod":
        const dir = this._parseExpression(nos[1]);
        const esq = this._parseExpression(nos[0]);
        return [
          new Instruction(expressao.simbolo, this._generateTempVar(), [
            esq[0].operand,
            dir[0].operand,
          ]),
          ...esq,
          ...dir,
        ];
        break;
    }
  }

  _optimizeAssignments(instrucoes: Instruction[]) {
    const atribuicoesTempValor: Instruction[] = [];
    const atribuicoesValorTemp: Instruction[] = [];

    for (const inst of instrucoes) {
      if (inst.operator !== "=") continue;
      if (inst.totalArgs !== 1) continue;
      if (!this._isTempVar(inst.operand)) continue;
      atribuicoesTempValor.push(inst);
    }

    for (const a of atribuicoesTempValor) {
      for (const inst of instrucoes) {
        if (a === inst) continue;
        while (inst._arguments.includes(a.operand)) {
          const indice = inst._arguments.indexOf(a.operand);
          inst._arguments[indice] = a.arg(0)!;
        }
      }
    }

    for (const inst of instrucoes) {
      if (inst.operator !== "=") continue;
      if (inst.totalArgs !== 1) continue;
      if (this._isTempVar(inst.operand)) continue;
      if (!this._isTempVar(inst.arg(0)!)) continue;
      atribuicoesValorTemp.push(inst);
    }

    for (const a of atribuicoesValorTemp) {
      for (const inst of instrucoes) {
        if (a === inst) continue;
        if (inst.operand !== a.arg(0)) continue;
        inst._operand = a.operand;
      }
    }

    return this._ajustarTemporarios(
      instrucoes.filter((i) => {
        return !(
          atribuicoesTempValor.includes(i) || atribuicoesValorTemp.includes(i)
        );
      })
    );
  }

  _optimizeWithAlgebraicProperties(instrucoes: Instruction[]) {
    for (const inst of instrucoes) {
      if (inst.operator === "retorne") continue;
      if (inst.operator === "=") continue;

      const args = inst.args;
      switch (inst.operator) {
        case "+":
          if (parseInt(args[0]) === 0 && parseInt(args[1]) === 0) {
            inst._operator = "=";
            inst._arguments = ["0"];
          } else if (parseInt(args[0]) !== 0 && parseInt(args[1]) === 0) {
            inst._operator = "=";
            inst._arguments = [args[0]];
          } else if (parseInt(args[0]) === 0 && parseInt(args[1]) !== 0) {
            inst._operator = "=";
            inst._arguments = [args[1]];
          }
          break;
        case "-":
          if (parseInt(args[0]) === 0 && parseInt(args[1]) === 0) {
            inst._operator = "=";
            inst._arguments = ["0"];
          } else if (parseInt(args[0]) !== 0 && parseInt(args[1]) === 0) {
            inst._operator = "=";
            inst._arguments = [args[0]];
          }
          break;
        case "*":
          if (parseInt(args[0]) === 1 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = ["1"];
          } else if (parseInt(args[0]) !== 0 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = [args[0]];
          } else if (parseInt(args[0]) === 1 && parseInt(args[1]) !== 1) {
            inst._operator = "=";
            inst._arguments = [args[1]];
          }
          break;
        case "/":
          if (parseInt(args[0]) === 1 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = ["1"];
          } else if (parseInt(args[0]) !== 1 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = [args[0]];
          }
          break;
        case "%":
          if (parseInt(args[0]) === 1 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = ["0"];
          } else if (parseInt(args[0]) !== 1 && parseInt(args[1]) === 1) {
            inst._operator = "=";
            inst._arguments = ["0"];
          }
          break;
      }
    }

    return instrucoes;
  }

  _ajustarTemporarios(instrucoes: Instruction[]) {
    let temp: string[] = [];

    for (const i of instrucoes) {
      if (this._isTempVar(i.operand)) temp.push(i.operand);
      for (const a of i.args) {
        if (this._isTempVar(a)) temp.push(a);
      }
    }

    temp = temp.filter((i, p) => temp.indexOf(i) === p);
    this._resetTempVar();

    for (const t of temp) {
      const novoTemp = this._generateTempVar();
      for (const i of instrucoes) {
        if (i.operand === t) i._operand = novoTemp;
        i._arguments = i._arguments.map((a) => (a === t ? novoTemp : a));
      }
    }

    return instrucoes;
  }

  _isTempVar(simbolo: string) {
    return matchExact(simbolo, /^<\d+>$/);
  }

  _resetTempVar() {
    this._temp = 0;
  }

  _generateTempVar() {
    return ["<", this._temp++, ">"].join("");
  }

  start() {
    return { gerados: this.comandos, optimizados: this.optimize() };
  }
}
