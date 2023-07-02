import Instruction from "./Instruction";

import { matchExact } from "../utils/Patterns";

import { Tree } from "../pipeline1/Tree";

type TokenType =
  | "literal-int"
  | "identifier"
  | "op-arithmetic-sub"
  | "op-arithmetic-adi"
  | "op-arithmetic-mul"
  | "op-arithmetic-div";

export default class Pipeline3 {
  _temp: number;
  _nonOptimizedInstructions: Instruction[][];

  constructor(commands: Tree[]) {
    this._temp = 0;

    const nonOptimizedInstructions: Instruction[][] = [];

    for (const c of commands) {
      nonOptimizedInstructions.push(this._parseCommand(c)!);
    }
    this._nonOptimizedInstructions = nonOptimizedInstructions;
  }

  get commands() {
    const commands = [];
    for (const com of this._nonOptimizedInstructions) commands.push(com.map((c) => c.copy()));
    return commands;
  }

  _parseCommand(command: Tree) {
    switch (command.simbolo) {
      case "=":
        return this._parseAssignment(command);
        break;
      case "return":
        return this._parseReturn(command);
        break;
    }
  }

  _parseAssignment(assignmentCommand: Tree) {
    this._resetTempVar();
    // atribuicao.nos[1] é o lado da atribuição que pode conter outras expressões
    const instructions = this._parseExpression(assignmentCommand.nos[1]);
    return [
      new Instruction(
        "=",
        assignmentCommand.nos[0].simbolo, // var
        [instructions[0].operand]
      ), // 10
      ...instructions,
    ].reverse();
  }

  _parseReturn(returnCommand: Tree) {
    this._resetTempVar();

    const instructions = this._parseExpression(returnCommand.nos[0]);
    return [
      new Instruction("return", returnCommand.simbolo, [instructions[0].operand]),
      ...instructions,
    ].reverse();
  }

  _parseExpression(expressao: Tree): Instruction[] {
    const token = expressao.extra!.token;
    const children = expressao.nos;

    switch (token.tipo as TokenType) {
      case "literal-int":
      case "identifier":
        return [
          new Instruction("=", this._generateTempVar(), [expressao.simbolo]),
        ];

      case "op-arithmetic-sub":
        if (children.length === 1) {
          const filho = this._parseExpression(children[0]);
          return [
            new Instruction(expressao.simbolo, this._generateTempVar(), [
              filho[0].operand,
            ]),
            ...filho,
          ];
        }
      case "op-arithmetic-adi":
      case "op-arithmetic-mul":
      case "op-arithmetic-div":
        const dir = this._parseExpression(children[1]);
        const esq = this._parseExpression(children[0]);
        return [
          new Instruction(expressao.simbolo, this._generateTempVar(), [
            esq[0].operand,
            dir[0].operand,
          ]),
          ...esq,
          ...dir,
        ];
    }
  }

  optimize() {
    const otimizados = [];
    const comandos = this.commands;
    for (const c of comandos) {
      let otimizado = this._optimizeAssignments(c);
      otimizados.push(this._optimizeMathOperations(otimizado));
    }

    return otimizados;
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

  _optimizeMathOperations(instrucoes: Instruction[]) {
    for (const inst of instrucoes) {
      if (inst.operator === "return") continue;
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
    return matchExact(simbolo, /^t\d+$/);
  }

  _resetTempVar() {
    this._temp = 0;
  }

  _generateTempVar() {
    const newVariable = this._temp++
    return `t${newVariable}`;
  }

  start() {
    console.log("PIPELINE 1... START!");

    return {
      nonOptimizedInstructions: this.commands,
      optimizedInstructions: this.optimize(),
    };
  }
}
