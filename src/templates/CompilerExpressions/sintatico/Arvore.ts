import Lexema from "../lexico/Lexema";
import Gramatica from "./Gramatica";
import Producao from "./Producao";

export type ReactD3Tree = {
    name: string;
    children: ReactD3Tree[];
};

export default class Arvore {
    _simbolo: string;
    _nos: Arvore[];
    _extra: Lexema | null;

    constructor(simbolo: string) {
        this._simbolo = simbolo;
        this._nos = [];
        this._extra = null;
    }

    get simbolo() {
        return this._simbolo;
    }
    get nos() {
        return [...this._nos];
    }
    get ehFolha() {
        return this._nos.length === 0;
    }
    get extra() {
        return this._extra;
    }
    set extra(extra) {
        this._extra = extra;
    }

    emOrdem(handle: (arv: Arvore) => void) {
        for (const no of this._nos) no.emOrdem(handle);
        handle(this);
    }

    preOrdem(handle: (arv: Arvore) => void) {
        handle(this);
        for (const no of this._nos) no.preOrdem(handle);
    }

    preOrdemMaxNivel(
        handle: (arv: Arvore) => void,
        maxNivel: number,
        atual: number
    ) {
        handle(this);
        if (maxNivel <= atual) return;
        for (const no of this._nos)
            no.preOrdemMaxNivel(handle, maxNivel, atual + 1);
    }

    posOrdem(handle: (arv: Arvore) => void) {
        handle(this);
        for (const no of this.nos.reverse()) no.posOrdem(handle);
    }

    encontrarTodosNosPreOrdem(simbolo: string, maxNivel?: number) {
        const listaNos: Arvore[] = [];

        if (typeof maxNivel === "number" && maxNivel > 0) {
            this.preOrdemMaxNivel(
                (no: Arvore) => {
                    if (no.simbolo === simbolo) listaNos.push(no);
                },
                maxNivel,
                0
            );
        } else {
            this.preOrdem((no: Arvore) => {
                if (no.simbolo === simbolo) listaNos.push(no);
            });
        }

        return listaNos;
    }

    static parsearProducoes(prods: Producao[], gram: Gramatica) {
        return Arvore._parsearProducoesDir(prods, gram);
    }

    static _parsearProducoesDir(prods: Producao[], gram: Gramatica) {
        // Remove a primeira produção da lista
        const p = prods.shift();

        // Se não for válida, retorna null
        if (p === undefined) return null;

        // Cria um nó com o símbolo da cabeça da produção
        const no = new Arvore(p.cabeca);

        // Para cada símbolo do corpo...
        for (const s of p.corpo.reverse()) {
            // Se ele for um terminal, apenas cria um nó e o adiciona como filho
            if (!gram.simboloEhNaoTerminal(s)) {
                no._nos.unshift(new Arvore(s));
                continue;
            }

            // Se for um não terminal, chama recursivamente esta função
            const noFilho = Arvore._parsearProducoesDir(prods, gram);

            // Se o nó retornado for válido, adiciona-o como filho
            if (noFilho !== null) no._nos.unshift(noFilho);
        }

        // Retorna o nó criado
        return no;
    }
}

export function getReactD3Tree(tree: Arvore) {
    const d3: ReactD3Tree = { name: tree.simbolo, children: [] };
    tree._nos.forEach((node, index) => {
        d3.children.push(getReactD3Tree(node));
    });

    if (tree.nos.length === 0 && tree.extra && tree.simbolo !== tree.extra.palavra) {
        d3.children.push({ name: tree.extra.palavra, children: [] });
    }
    return d3;
}
