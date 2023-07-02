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
    for (const com of this._nonOptimizedInstructions)
      commands.push(com.map((c) => c.copy()));
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
      new Instruction("return", returnCommand.simbolo, [
        instructions[0].operand,
      ]),
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
    const optimizedCommands = [];

    const commands = this.commands;
    for (const c of commands) {
      let optimized = this._optimizeAssignments(c);
      optimizedCommands.push(optimized);
    }

    return optimizedCommands;
  }

  _optimizeAssignments(instructions: Instruction[]) {
    // Caso 1
    const assignmentsCase1: Instruction[] = [];
    // Busca por atribuições com variáveis temporários como operandos.
    for (const inst of instructions) {
      if (inst.operator !== "=") continue;
      if (inst.totalArgs !== 1) continue;
      if (!this._isTempVar(inst.operand)) continue; // caso o operando não seja varTemp
      assignmentsCase1.push(inst);
    }

    // Para cada instrução de atribuição, iteramos sobre as instruções substituindo o valor do argumento, removendo a variável temporária.
    for (const a of assignmentsCase1) {
      for (const inst of instructions) {
        if (a === inst) continue;
        while (inst._arguments.includes(a.operand)) {
          const indice = inst._arguments.indexOf(a.operand);
          inst._arguments[indice] = a.arg(0)!;
        }
      }
    }

    // Caso 2
    const assignmentsCase2: Instruction[] = [];
    // Fazemo os mesmo para quando uma instrução tem variáveis temporárias como operando e argumentos.
    for (const inst of instructions) { // é atribuição, possui um argumento, o operando não é varTemp e o argumento é varTemp
      if (inst.operator !== "=") continue;
      if (inst.totalArgs !== 1) continue;
      if (this._isTempVar(inst.operand)) continue; // caso o operando seja varTemp
      if (!this._isTempVar(inst.arg(0)!)) continue; // caso o argumento não seja varTemp
      assignmentsCase2.push(inst);
    }

    for (const a of assignmentsCase2) {
      for (const inst of instructions) {
        if (a === inst) continue;
        if (inst.operand !== a.arg(0)) continue;
        inst._operand = a.operand; // Corrige a instrução colocando o literal em seu lugar.
      }
    }

    return this._countTempVariablesAgain(
      instructions.filter(
        (i) =>
          !(
            assignmentsCase1.includes(i) || assignmentsCase2.includes(i)
          )
      )
    );
  }

  _countTempVariablesAgain(instructions: Instruction[]) {
    let temp: string[] = [];

    // Itera sobre as instruções para encontrar varTemps.
    for (const i of instructions) {
      if (this._isTempVar(i.operand)) temp.push(i.operand);
      for (const a of i.args) {
        if (this._isTempVar(a)) temp.push(a);
      }
    }

    temp = temp.filter((i, p) => temp.indexOf(i) === p); // remove os valores duplicados
    this._resetTempVar();

    // realiza a contagem das variáveis temporárias novamente.
    for (const t of temp) {
      const novoTemp = this._generateTempVar();
      for (const i of instructions) {
        if (i.operand === t) i._operand = novoTemp;
        i._arguments = i._arguments.map((a) => (a === t ? novoTemp : a));
      }
    }

    return instructions;
  }

  _isTempVar(simbolo: string) {
    return matchExact(simbolo, /^t\d+$/);
  }

  _resetTempVar() {
    this._temp = 0;
  }

  _generateTempVar() {
    const newVariable = this._temp++;
    return `t${newVariable}`;
  }

  start() {
    console.log("PIPELINE 3... START!");

    const nonOptimizedInstructions = this.commands;

    const optimizedInstructions = this.optimize();

    return {
      nonOptimizedInstructions,
      optimizedInstructions,
    };
  }
}
