import { intAutomaton, reconizeSentence } from "./IntAutomaton";

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
    "literal-int": (s: string) => reconizeSentence(s, intAutomaton), // Não está mais sendo utilizado
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