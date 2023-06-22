import Grammar from "./Grammar";

type Follows = {
    [key: string]: string[];
}

type Firsts = {
    [key: string]: string[];
}

type TableRow = {
    [key: string]: Object | null;
}

export type Table = {
    [key: string]: TableRow;
};

export default class LL1 {
    sentential?: string;
    delimiter?: string;
    grammar?: Grammar;
    table?: Table;

    constructor() {
        this.sentential = undefined;
        this.delimiter = undefined;
        this.grammar = undefined;
        this.table = undefined;
    }

    analyse(input: string) {
        let entrada = input.split("");

        // Adiciona o símbolo de fim de cadeia ao final da entrada
        let entradaPos = 0;
        entrada.push(this.delimiter!);

        // Cria a pilha com o símbolo inicial e o símbolo de fim de cadadeia
        let pilha = [this.sentential, this.delimiter];

        // Cria uma lista vazia para as produções que irão descrever a árvore
        const prods = [];

        // Enquanto o topo da pilha não for o símbo de fim de cadeia...
        while (pilha[0] !== this.delimiter) {
            // Se o topo da pilha for igual ao símbolo atual da entrada,
            // houve um casamento
            if (pilha[0] === entrada[0]) {
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
            if (!this.grammar?.isNonTerminal(pilha[0]!)) {
                throw {
                    posicao: entradaPos,
                    esperado: pilha[0],
                    encontrado: entrada[0],
                };
            }

            // Busca na tabela sintática a produção que deve ser aplicada
            const prod: any =
                this.table![pilha[0] as keyof typeof this.table][
                entrada[0] as keyof typeof this.table
                ];

            // Se não exisir uma produção, gera um erro
            if (prod === null || prod === undefined) {
                // Relata os símbolos esperados e o encontrado
                throw {
                    posicao: entradaPos,
                    esperado: LL1.firsts(pilha[0]!, this.grammar),
                    encontrado: entrada[0],
                };
            }

            // Adiciona a produção a lista final
            prods.push(prod);

            // Desempilha o símbolo
            pilha.shift();

            // Empilha os símbolos do corpo da produção encontrada
            pilha = [
                ...prod.right.filter(
                    (s: string) => !this.grammar!.isEmptySymbol(s)
                ),
                ...pilha,
            ];
        }

        // Retorna a lista das produções
        return prods;
    }

    static create(gram: Grammar, inicial: string, fdc: string) {
        if (typeof gram !== "object") {
            throw "A gramática deve ser uma instância de Gramatica";
        }

        if (typeof inicial !== "string") {
            throw "O símbolo inicial deve ser uma string não vazia";
        }

        if (!gram.isNonTerminal(inicial)) {
            throw "O símbolo inicial deve ser um símbolo não terminal da gramática";
        }

        if (typeof fdc !== "string") {
            throw "O símbolo de fim de cadeia deve ser uma string não vazia";
        }

        if (gram.isNonTerminal(fdc)) {
            throw "O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática";
        }

        if (gram.terminals.includes(fdc)) {
            throw "O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática";
        }

        const ll1 = new LL1();
        ll1.grammar = gram;
        ll1.sentential = inicial;
        ll1.delimiter = fdc;
        ll1.table = LL1.createTable(inicial, fdc, gram);

        return ll1;
    }

    static createTable(inicial: string, fdc: string, gram: Grammar) {
        // Cria o objeto chave valor para a tabela
        const tabela: Table = {};

        // Guarda os símbolos não terminais da gramática
        const naoTerminais = gram.nonTerminals;

        // Guarda os símbolos terminais e mais o símbolo de fim de cadadeia na
        // mesma lista
        const terminais = [...gram.terminals, fdc];

        // Guarda todas as produções
        const producoes = gram.productions;

        // Para cada símbolo não terminal...
        for (const snt of naoTerminais) {
            // Cria a "linha" na tabela
            tabela[snt] = {};

            // Para cada símbolo terminal...
            for (const st of terminais) {
                // Cria a "coluna" na tabela, caso não seja o vazio
                if (gram.isEmptySymbol(st)) continue;
                tabela[snt][st] = null;
            }
        }

        // Calcula os seguidores
        const seguidores: Follows = LL1.followers(inicial, fdc, gram);
        // Cria um objeto chave-valor para guardar temporáriamente os primerios
        const primeiros: Firsts = {};

        // Para cada produção...
        for (const prod of producoes) {
            // Guarda a string do corpo e a linha da tabela referente ao não terminal
            const corpoStr = prod.right.join("");
            const tabelaLinha = tabela[prod.left];

            // Calcula os primeiros da produção, caso não já tenha sido calculdo
            if (primeiros[corpoStr] === undefined) {
                primeiros[corpoStr] = LL1.firsts(corpoStr, gram) as string[];
            }

            // Se os primerios incluirem o vazio...
            if (primeiros[corpoStr].includes(gram._empty)) {
                // Adiciona a produção nas colunas de dos seguidores da cabeça
                for (const seguidor of seguidores[prod.left]) {
                    if (tabelaLinha[seguidor] === null) {
                        tabelaLinha[seguidor] = prod;
                        continue;
                    }

                    // Se a celula não estiver vazia, gera erro de não determinismo
                    throw "Não determinísmo";
                }
            }
            // Se os primeiros não incluirem o vazio...
            else {
                // Adiciona a produção nas colunas dos símbolos dos primeiros do corpo
                for (const primeiro of primeiros[corpoStr]) {
                    if (tabelaLinha[primeiro] === null) {
                        tabelaLinha[primeiro] = prod;
                        continue;
                    }

                    // Se a celula não estiver vazia, gera erro de não determinismo
                    throw "Não determinísmo";
                }
            }
        }
        // Retorna a tabela
        return tabela;
    }

    static firsts(input: string, gram: Grammar): (string | undefined)[] {
        let ent = input.split('');
        let primeiros: (string | undefined)[] = [];

        for (const index in ent) {
            const atual = ent[index];
            if (gram.isEmptySymbol(atual)) continue;
            if (!gram.isNonTerminal(atual)) return [atual];

            ent = ent.splice(Number(index));

            const prods = gram.getNonTerminalsProductions(atual);
            for (const prod of prods) {
                const saida = prod.applyByLeft(ent.join(""));
                const snv = saida.split('').find((s) => !gram.isEmptySymbol(s));

                if (snv === undefined) {
                    primeiros.push(gram._empty);
                    continue;
                }

                if (!gram.isNonTerminal(snv)) {
                    primeiros.push(snv);
                    continue;
                }

                primeiros = [...primeiros, ...LL1.firsts(saida, gram)];
            }

            primeiros = primeiros.filter((s, i) => {
                if (gram.isEmptySymbol(s!)) return i === primeiros.length - 1;
                else return primeiros.indexOf(s) === i;
            });

            if (primeiros.length >= 1 && !gram.isEmptySymbol(primeiros[0]!)) break;
        }

        return primeiros.length > 0 ? primeiros : [gram._empty];
    }

    static followers(inicial: string, fdc: string, gram: Grammar) {
        const descricao: Record<string, any> = {};
        descricao[inicial] = {
            valor: [fdc],
            seguidores: [],
            primeiros: [],
        };

        const primeiros: Record<string, any> = {};
        const producoes = gram.productions;

        for (const snt of gram.nonTerminals) {
            if (descricao[snt] === undefined)
                descricao[snt] = {
                    valor: [],
                    seguidores: [],
                    primeiros: [],
                };

            for (const prod of producoes) {
                const pos = prod.right.indexOf(snt);
                if (pos === -1) continue;

                // A -> aB
                if (pos === prod.right.length - 1) {
                    descricao[snt].seguidores.push(prod.left);
                    continue;
                }

                const ps = prod.right[pos + 1];

                // A -> aBb onde b é terminal
                if (!gram.isNonTerminal(ps)) {
                    descricao[snt].valor.push(ps);
                    continue;
                }

                if (primeiros[ps] === undefined) {
                    primeiros[ps] = LL1.firsts(ps, gram);
                }

                // A -> aBC, onde vazio não pertence a primeiros(C)
                if (!primeiros[ps].includes(gram._empty)) {
                    descricao[snt].primeiros.push(ps);
                    continue;
                }

                // A -> aBC, onde vazio pertence a primeiros(C)
                descricao[snt].primeiros.push(ps);
                descricao[snt].seguidores.push(prod.left);
            }
        }

        const seguidores: Record<string, any> = {};
        let algumIncompleto = true;
        while (algumIncompleto) {
            for (const snt of gram.nonTerminals) {
                if (seguidores[snt] === undefined) {
                    seguidores[snt] = null;
                }

                if (seguidores[snt] !== null) continue;

                for (const i in descricao[snt].primeiros) {
                    if (typeof descricao[snt].primeiros[i] !== "string") continue;

                    const simbolo = descricao[snt].primeiros[i];
                    if (primeiros[simbolo] === undefined) {
                        primeiros[simbolo] = LL1.firsts(simbolo, gram);
                    }
                    descricao[snt].primeiros[i] = primeiros[simbolo];
                }

                let seguidoresPententes = false;
                for (const i in descricao[snt].seguidores) {
                    if (typeof descricao[snt].seguidores[i] !== "string") continue;
                    const simbolo = descricao[snt].seguidores[i];

                    if (descricao[simbolo].seguidores.indexOf(snt) !== -1) {
                        descricao[snt].seguidores[i] = [];
                        continue;
                    }

                    if (snt === simbolo) {
                        descricao[snt].seguidores[i] = [];
                        continue;
                    }

                    if (
                        seguidores[simbolo] === null ||
                        seguidores[simbolo] === undefined
                    ) {
                        seguidoresPententes = true;
                        continue;
                    }

                    descricao[snt].seguidores[i] = seguidores[simbolo];
                }

                if (!seguidoresPententes) {
                    seguidores[snt] = [...descricao[snt].valor];

                    for (const a of descricao[snt].primeiros) {
                        seguidores[snt] = [...seguidores[snt], ...a];
                    }

                    for (const a of descricao[snt].seguidores) {
                        seguidores[snt] = [...seguidores[snt], ...a];
                    }

                    seguidores[snt] = seguidores[snt].filter((s: string | undefined, i: number) => {
                        return seguidores[snt].indexOf(s) === i && s !== gram._empty;
                    });
                }
            }

            algumIncompleto = false;
            for (const snt of gram.nonTerminals) {
                if (seguidores[snt] === null) {
                    algumIncompleto = true;
                    break;
                }
            }
        }

        return seguidores;
    }
}
