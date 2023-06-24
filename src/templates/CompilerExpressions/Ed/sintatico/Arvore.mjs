export default class Arvore {

    constructor(simbolo) {
        this._simbolo = simbolo;
        this._nos = [];
        this._extra = null;
    }

    get simbolo() { return this._simbolo; }
    get nos() { return [ ...this._nos ]; }
    get ehFolha() { return this._nos.length === 0; }
    get extra() { return this._extra; }
    set extra(extra) { this._extra = extra; }

    emOrdem (handle) {
        for (const no of this._nos) no.emOrdem(handle);
        handle(this);
    }

    preOrdem (handle) {
        handle(this);
        for (const no of this._nos) no.preOrdem(handle);
    }

    preOrdemMaxNivel (handle, maxNivel, atual) {
        handle(this);
        if(maxNivel <= atual) return;
        for (const no of this._nos) no.preOrdemMaxNivel(handle, maxNivel, atual + 1);
    }

    posOrdem (handle) {
        handle(this);
        for (const no of this.nos.reverse()) no.posOrdem(handle);
    }

    encontrarTodosNosPreOrdem (simbolo, maxNivel) {
        const listaNos = [];

        if(typeof(maxNivel) === 'number' && maxNivel > 0) {
            this.preOrdemMaxNivel(
                (no) => { if(no.simbolo === simbolo) listaNos.push(no); },
                maxNivel,
                0
            );
        }
        else {
            this.preOrdem(
                (no) => { if(no.simbolo === simbolo) listaNos.push(no); }
            );
        }

        return listaNos;
    }

    static parsearProducoes (prods, gram) {
        return Arvore._parsearProducoesDir(prods, gram);
    }

    static _parsearProducoesDir (prods, gram) {

        // Remove a primeira produção da lista
        const p = prods.shift();

        // Se não for válida, retorna null
        if(p === undefined) return null;

        // Cria um nó com o símbolo da cabeça da produção
        const no = new Arvore(p.cabeca);

        // Para cada símbolo do corpo...
        for (const s of p.corpo.reverse()) {

            // Se ele for um terminal, apenas cria um nó e o adiciona como filho
            if (!gram.simboloEhNaoTerminal(s)){
                no._nos.unshift(new Arvore(s));
                continue;
            }

            // Se for um não terminal, chama recursivamente esta função
            const noFilho = Arvore._parsearProducoesDir(prods, gram);

            // Se o nó retornado for válido, adiciona-o como filho
            if(noFilho !== null) no._nos.unshift(noFilho);
        }

        // Retorna o nó criado
        return no;
    }
}
