export const patterns = {
    opAritmeticos: ["+", "-", "*", "/"],
    especiais: ["=", "(", ")", ",", ":", ";"],

    nomeEscalares: ["int"],
    palavras: ["VAR", "BEGIN", "END.", "return"],

    stringLiteral: "([\"'])(?:(?=(\\\\?))\\2.)*?\\1",
    identificadores: /^[a-zA-Z\_][a-zA-Z\_0-9]*$/,

    espacos: /\s+/g,
    EOL: /\r?\n/,
};

export const matchExact = (str: string, regex: RegExp) => {
    const m = str.match(regex);
    return m !== null && str === m[0];
};

export const isSpace = (s: string) => matchExact(s, patterns.espacos);

export const isStringLiteral = (s: string) =>
    matchExact(s, new RegExp("^" + patterns.stringLiteral + "$"));

export const tokenClasses = {
    "name-scalar": (s: string) => patterns.nomeEscalares.includes(s),
    command: (s: string) => patterns.palavras.includes(s),
    "op-arithmetic": (s: string) => patterns.opAritmeticos.includes(s),
    symbol: (s: string) => patterns.especiais.includes(s),
    identifier: (s: string) => matchExact(s, patterns.identificadores),
    "literal-int": (s: string) => reconizeSentence(s, automaton), // Não está mais sendo utilizado
    "sem-categoria": (s: string) => true,
};

export const getTokenClass = (lexema: string) => {
    return Object.keys(tokenClasses).find((c) =>
        tokenClasses[c as keyof typeof tokenClasses](lexema)
    );
};

export const tokenSubClass = {
    "name-scalar": (s: string) =>
        patterns.nomeEscalares.find((t) => t === s)?.substr(0, 4),
    command: (s: string) => patterns.palavras.find((t) => t === s),
    "op-arithmetic": (s: string) => {
        return {
            "+": "adi",
            "-": "sub",
            "*": "mul",
            "/": "div",
            "%": "mod",
        }[s];
    },
    symbol: (s: string) => {
        return {
            "=": "atr",
            "(": "apa",
            ")": "fpa",
            ",": "vir",
            ":": "colon",
            ";": "delimiter",
        }[s];
    },
    "literal-int": (s: string) => "",
    identifier: (s: string) => "",
    "sem-categoria": (s: string) => "",
};

export const getTokenSubClass = (lexema: string, classe: string) => {
    return tokenSubClass[classe as keyof typeof tokenSubClass](lexema);
};

export type Automaton = {
    name: string;
    states: { label: string; value: number }[];
    alphabet: { label: string; value: number }[];
    transitions: number[][];
    initialState: number;
    finalStates: number[];
};

const reconizeSentence = (sentence: string, automaton: Automaton): boolean => {
    let currentState = automaton.initialState;
    for (let i = 0; i < sentence.length; i++) {
        const char = automaton.alphabet.find(
            (t) => t.label === sentence.charAt(i)
        )?.value;
        if (currentState !== undefined && char !== undefined) {
            currentState = automaton.transitions[char][currentState];
        } else {
            currentState = -1; // Estado de erro
        }
    }
    if (automaton.finalStates.includes(currentState)) {
        return true;
    }
    return false;
};

const automaton = {
    name: "literal-int",
    states: [
        { label: "q0", value: 0 },
        { label: "q1", value: 1 },
        { label: "q2", value: 2 },
    ],
    alphabet: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
    ],
    transitions: [
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
        [1, 1, 2],
    ],
    initialState: 0,
    finalStates: [1],
};
