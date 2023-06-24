import Gramatica from "./Gramatica";
import Production from "./Production";

export default class Arvore {
    name: string
    children: Arvore[]
    extra: any

    constructor(name: string) {
        this.name = name;
        this.children = [];
        this.extra = null;
    }


    get ehFolha() { return this.children.length === 0; }

    emOrdem(handle: (arv: Arvore) => void) {
        for (const no of this.children) no.emOrdem(handle);
        handle(this);
    }

    preOrdem(handle: (arv: Arvore) => void) {
        handle(this);
        for (const no of this.children) no.preOrdem(handle);
    }

    preOrdemMaxNivel(handle: (arv: Arvore) => void, maxNivel: number, atual: number) {
        handle(this);
        if (maxNivel <= atual) return;
        for (const no of this.children) no.preOrdemMaxNivel(handle, maxNivel, atual + 1);
    }

    posOrdem(handle: (arv: Arvore) => void) {
        handle(this);
        for (const no of this.children.reverse()) no.posOrdem(handle);
    }

    encontrarTodosNosPreOrdem(simbolo: string, maxNivel: number) {
        const listaNos: Arvore[] = [];

        if (typeof (maxNivel) === 'number' && maxNivel > 0) {
            this.preOrdemMaxNivel(
                (no) => { if (no.name === simbolo) listaNos.push(no); },
                maxNivel,
                0
            );
        }
        else {
            this.preOrdem(
                (no) => { if (no.name === simbolo) listaNos.push(no); }
            );
        }

        return listaNos;
    }

    static parsearProducoes(prods: Production[], gram: Gramatica) {
        return Arvore._parsearProducoesDir(prods, gram);
    }

    static _parsearProducoesDir(prods: Production[], gram: Gramatica) {

        // Remove a primeira produção da lista
        const p = prods.shift();

        // Se não for válida, retorna null
        if (p === undefined) return null;

        // Cria um nó com o símbolo da cabeça da produção
        const no = new Arvore(p.left);

        // Para cada símbolo do corpo...
        for (const s of p.right.reverse()) {

            // Se ele for um terminal, apenas cria um nó e o adiciona como filho
            if (!gram.simboloEhNaoTerminal(s)) {
                no.children.unshift(new Arvore(s));
                continue;
            }

            // Se for um não terminal, chama recursivamente esta função
            const noFilho = Arvore._parsearProducoesDir(prods, gram);

            // Se o nó retornado for válido, adiciona-o como filho
            if (noFilho !== null) no.children.unshift(noFilho);
        }

        // Retorna o nó criado
        return no;
    }
}
