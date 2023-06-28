import { Tree } from "../pipeline1/Tree";

import Intermediario from "./Intermediario";

export default class Pipeline2 {
  expressions: Tree[];

  constructor(expressions: Tree[]) {
    this.expressions = expressions;
  }

  start() {
    const intermediario = new Intermediario(this.expressions);
    const gerados = intermediario.comandos;
    const optimizados = intermediario.optimizar();

    return { intermediario, gerados, optimizados };
  }
}
