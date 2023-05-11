/**
 * Classe responsável por representar analisadores LL(1)
 */
export default class LL1 {

    constructor () {
        this._inicial = null;
        this._fdc = null;
        this._gramatica = null;
        this._tabela = null;
    }

    /**
     * Realiza a análise sintática de uma entrada e retorna uma lista de produções
     * @param  {string|[string]} entrada String ou lista de string como entrada
     * @return {[Producao]}
     */
    analisar (entrada) {

        // Se a entrada for uma string, converte para uma lista de caracteres
        if(typeof(entrada) === 'string') entrada = [ ...entrada ];

        // Se não for uma lista, lança um erro
        if(typeof(entrada) !== 'object' || !(entrada instanceof Array)) {
            throw 'A entrada deve ser uma string ou uma lista de tokens';
        }

        // Adiciona o símbolo de fim de cadeia ao final da entrada
        let entradaPos = 0;
        entrada.push(this._fdc);

        // Cria a pilha com o símbolo inicial e o símbolo de fim de cadadeia
        let pilha = [ this._inicial, this._fdc ];

        // Cria uma lista vazia para as produções que irão descrever a árvore
        const prods = [];

        // Enquanto o topo da pilha não for o símbo de fim de cadeia...
        while (pilha[0] !== this._fdc) {

            // Se o topo da pilha for igual ao símbolo atual da entrada,
            // houve um casamento
            if(pilha[0] === entrada[0]) {
                // Desempilha o símbolo
                pilha.shift();

                entradaPos++;

                // Remove o símbolo do inicio da entrada
                entrada.shift();

                // Continua para o próxim símbolo
                continue;
            }

            // Se o topo for um símbolo terminal diferente do atual da entrada,
            // gera erro
            if (!this._gramatica.simboloEhNaoTerminal(pilha[0])) {
                throw {
                    posicao: entradaPos,
                    esperado: pilha[0],
                    encontrado: entrada[0]
                };
            }

            // Busca na tabela sintática a produção que deve ser aplicada
            const prod = this._tabela[pilha[0]][entrada[0]];

            // Se não exisir uma produção, gera um erro
            if (prod === null || prod === undefined) {
                // Relata os símbolos esperados e o encontrado
                throw {
                    posicao: entradaPos,
                    esperado: LL1._primeiros(pilha[0], this._gramatica),
                    encontrado: entrada[0]
                };
            }

            // Adiciona a produção a lista final
            prods.push(prod);

            // Desempilha o símbolo
            pilha.shift();

            // Empilha os símbolos do corpo da produção encontrada
            pilha = [
                ...prod.corpo.filter(s => !this._gramatica.simboloEhVazio(s)),
                ...pilha
            ];
        }

        // Retorna a lista das produções
        return prods;
    }

    /**
     * Cria uma instância de LL1
     * @param  {Gramatica} gram    Gramática que será utilizada para as analises
     * @param  {string} inicial Símbolo inicial da gramática
     * @param  {string} fdc     Símbolo de fim de cadeia
     * @return {LL1}
     */
    static criar (gram, inicial, fdc) {

        if (typeof(gram) !== 'object') {
            throw 'A gramática deve ser uma instância de Gramatica';
        }

        if (typeof(inicial) !== 'string') {
            throw 'O símbolo inicial deve ser uma string não vazia';
        }

        if (!gram.simboloEhNaoTerminal(inicial)) {
            throw 'O símbolo inicial deve ser um símbolo não terminal da gramática';
        }

        if (typeof(fdc) !== 'string') {
            throw 'O símbolo de fim de cadeia deve ser uma string não vazia';
        }

        if (gram.simboloEhNaoTerminal(fdc)) {
            throw 'O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática';
        }

        if (gram._terminais.includes(fdc)) {
            throw 'O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática';
        }

        const ll1 = new LL1();
        ll1._gramatica = gram;
        ll1._inicial = inicial;
        ll1._fdc = fdc;
        ll1._tabela = LL1._criarTabela(inicial, fdc, gram);

        return ll1;
    }

    /**
     * Cria a tabela sintática de uma gramática LL(1)
     * @param  {string} inicial Símbolo inicial da gramática
     * @param  {string} fdc     Símbolo de fim de cadeias
     * @param  {Gramatica} gram    Gramática
     * @return {object}
     */
    static _criarTabela (inicial, fdc, gram) {

        // Cria o objeto chave valor para a tabela
        const tabela = {};

        // Guarda os símbolos não terminais da gramática
        const naoTerminais = gram._naoTerminais;

        // Guarda os símbolos terminais e mais o símbolo de fim de cadadeia na
        // mesma lista
        const terminais = [ ...gram._terminais, fdc ];

        // Guarda todas as produções
        const producoes = gram.producoes;

        // Para cada símbolo não terminal...
        for (const snt of naoTerminais) {

            // Cria a "linha" na tabela
            tabela[snt] = {};

            // Para cada símbolo terminal...
            for (const st of terminais){
                // Cria a "coluna" na tabela, caso não seja o vazio
                if(gram.simboloEhVazio(st)) continue;
                tabela[snt][st] = null;
            }
        }

        // Calcula os seguidores
        const seguidores = LL1._seguidores(inicial, fdc, gram);

        // Cria um objeto chave-valor para guardar temporáriamente os primerios
        const primeiros = {};

        // Para cada produção...
        for (const prod of producoes) {

            // Guarda a string do corpo e a linha da tabela referente ao não terminal
            const corpoStr = prod.corpo.join('');
            const tabelaLinha = tabela[prod.cabeca];

            // Calcula os primeiros da produção, caso não já tenha sido calculdo
            if (primeiros[corpoStr] === undefined) {
                primeiros[corpoStr] = LL1._primeiros(corpoStr, gram);
            }

            // Se os primerios incluirem o vazio...
            if (primeiros[corpoStr].includes(gram.vazio)) {

                // Adiciona a produção nas colunas de dos seguidores da cabeça
                for (const seguidor of seguidores[prod.cabeca]) {

                    if(tabelaLinha[seguidor] === null) {
                        tabelaLinha[seguidor] = prod;
                        continue;
                    }

                    // Se a celula não estiver vazia, gera erro de não determinismo
                    throw 'Não determinísmo';
                }
            }
            // Se os primeiros não incluirem o vazio...
            else {

                // Adiciona a produção nas colunas dos símbolos dos primeiros do corpo
                for (const primeiro of primeiros[corpoStr]) {
                    if(tabelaLinha[primeiro] === null) {
                        tabelaLinha[primeiro] = prod;
                        continue;
                    }

                    // Se a celula não estiver vazia, gera erro de não determinismo
                    throw 'Não determinísmo';
                }
            }
        }

        // Retorna a tabela
        return tabela;
    }

    /**
     * Retorna a lista de primerios de uma determinada entrada em uma gramática
     * @param  {string} ent  Entrada que será analisada
     * @param  {Gramatica} gram Gramática
     * @return {[string]}
     */
    static _primeiros (ent, gram) {

        ent = [ ...ent ];
        let primeiros = [];

        for (const index in ent) {

            const atual = ent[index];
            if(gram.simboloEhVazio(atual)) continue;
            if (!gram.simboloEhNaoTerminal(atual)) return [ atual ];

            ent = ent.splice(index);

            const prods = gram._buscarProducoesPorNaoTerminal(atual);
            for (const prod of prods) {
                const saida = prod.aplicarPelaEsquerda(ent.join(''));
                const snv = [ ...saida ].find(s => !gram.simboloEhVazio(s));

                if (snv === undefined) {
                    primeiros.push(gram.vazio);
                    continue;
                }

                if (!gram.simboloEhNaoTerminal(snv)) {
                    primeiros.push(snv);
                    continue;
                }

                primeiros = [ ...primeiros, ...LL1._primeiros(saida, gram) ];
            }

            primeiros = primeiros.filter((s, i) => {
                if (gram.simboloEhVazio(s)) return i === primeiros.length - 1;
                else return primeiros.indexOf(s) === i;
            });

            if(primeiros.length >= 1 && !gram.simboloEhVazio(primeiros[0])) break;
        }

        return primeiros.length > 0 ? primeiros : [ gram.vazio ];
    }

    /**
     * Retorna todos os seguidores de todos símbolos não terminais de uma gramática
     * @param  {string} inicial Símbolo inicial da gramática
     * @param  {string} fdc     Símbolo de fim de cadeia
     * @param  {Gramatica} gram    Gramática
     * @return {Object}
     */
    static _seguidores (inicial, fdc, gram) {

        const descricao = {};
        descricao[inicial] = {
            valor: [ fdc ],
            seguidores: [],
            primeiros: []
        };

        const primeiros = {};
        const producoes = gram.producoes;

        for (const snt of gram._naoTerminais) {

            if(descricao[snt] === undefined) descricao[snt] = {
                valor: [],
                seguidores: [],
                primeiros: []
            };

            for (const prod of producoes) {
                const pos = prod.corpo.indexOf(snt);
                if(pos === -1) continue;

                // A -> aB
                if(pos === prod.corpo.length - 1) {
                    descricao[snt].seguidores.push(prod.cabeca)
                    continue;
                }

                const ps = prod.corpo[pos + 1];

                // A -> aBb onde b é terminal
                if (!gram.simboloEhNaoTerminal(ps)) {
                    descricao[snt].valor.push(ps);
                    continue;
                }

                if (primeiros[ps] === undefined) {
                    primeiros[ps] = LL1._primeiros(ps, gram);
                }

                // A -> aBC, onde vazio não pertence a primeiros(C)
                if (!primeiros[ps].includes(gram.vazio)) {
                    descricao[snt].primeiros.push(ps);
                    continue;
                }

                // A -> aBC, onde vazio pertence a primeiros(C)
                descricao[snt].primeiros.push(ps);
                descricao[snt].seguidores.push(prod.cabeca);
            }
        }

        const seguidores = {};
        let algumIncompleto = true;
        while(algumIncompleto) {

            for (const snt of gram._naoTerminais) {

                if(seguidores[snt] === undefined) {
                    seguidores[snt] = null;
                }

                if(seguidores[snt] !== null) continue;

                for (const i in descricao[snt].primeiros) {

                    if(typeof(descricao[snt].primeiros[i]) !== 'string') continue;

                    const simbolo = descricao[snt].primeiros[i];
                    if (primeiros[simbolo] === undefined) {
                        primeiros[simbolo] = LL1._primeiros(simbolo, gram);
                    }
                    descricao[snt].primeiros[i] = primeiros[simbolo];
                }

                let seguidoresPententes = false;
                for (const i in descricao[snt].seguidores) {

                    if(typeof(descricao[snt].seguidores[i]) !== 'string') continue;
                    const simbolo = descricao[snt].seguidores[i];

                    if (descricao[simbolo].seguidores.indexOf(snt) !== -1) {
                        descricao[snt].seguidores[i] = [];
                        continue;
                    }

                    if (snt === simbolo) {
                        descricao[snt].seguidores[i] = [];
                        continue;
                    }

                    if(seguidores[simbolo] === null || seguidores[simbolo] === undefined) {
                        seguidoresPententes = true;
                        continue;
                    }

                    descricao[snt].seguidores[i] = seguidores[simbolo];
                }


                if(!seguidoresPententes) {
                    seguidores[snt] = [ ...descricao[snt].valor ];

                    for (const a of descricao[snt].primeiros) {
                        seguidores[snt] = [ ...seguidores[snt], ...a ];
                    }

                    for (const a of descricao[snt].seguidores) {
                        seguidores[snt] = [ ...seguidores[snt], ...a ];
                    }

                    seguidores[snt] = seguidores[snt].filter((s, i) => {
                        return seguidores[snt].indexOf(s) === i && s !== gram.vazio;
                    });
                }
            }

            algumIncompleto = false;
            for (const snt of gram._naoTerminais) {
                if (seguidores[snt] === null) {
                    algumIncompleto = true;
                    break;
                }
            }

        }

        return seguidores;
    }
}
