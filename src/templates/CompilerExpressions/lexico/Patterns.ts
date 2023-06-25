export const patterns = {

    opAritmeticos: ['+', '-', '*', '/', '%'],
    especiais: ['=', '(', ')', ',', ':', ';'],

    nomeEscalares: ['int'],
    palavras: ['variaveis', 'inicio', 'fim', 'retorne'],

    stringLiteral: "([\"'])(?:(?=(\\\\?))\\2.)*?\\1",
    intLiteral: /^[1-9][0-9]*|0([1-7][0-7]*|x[0-9a-zA-Z]+)?$/,
    identificadores: /^[a-zA-Z\_][a-zA-Z\_0-9]*$/,

    espacos: /\s+/g,
    EOL: /\r?\n/
};

export const matchExact = (str: string, regex: RegExp) => {
    const m = str.match(regex);
    return m !== null && str === m[0];
}

export const isSpace = (s: string) => matchExact(s, patterns.espacos);

export const isStringLiteral = (s: string) => matchExact(
    s, new RegExp('^' + patterns.stringLiteral + '$')
);

export const tokenClasses = {
    'nome-escalar': (s: string) => patterns.nomeEscalares.includes(s),
    'comando': (s: string) => patterns.palavras.includes(s),
    'op-aritmetico': (s: string) => patterns.opAritmeticos.includes(s),
    'especial': (s: string) => patterns.especiais.includes(s),
    'identificador': (s: string) => matchExact(s, patterns.identificadores),
    'literal-int': (s: string) => matchExact(s, patterns.intLiteral),
    'sem-categoria': (s: string) => true
};

export const getTokenClass = (lexema: string) => {
    return Object.keys(tokenClasses).find(
        c => tokenClasses[c as keyof typeof tokenClasses](lexema)
    );
}

export const tokenSubClass = {
    'nome-escalar': (s: string) => patterns.nomeEscalares.find(t => t === s)?.substr(0, 4),
    'comando': (s: string) => patterns.palavras.find(t => t === s)?.substr(0, 4),
    'op-aritmetico': (s: string) => {
        return {
            '+': 'adi',
            '-': 'sub',
            '*': 'mul',
            '/': 'div',
            '%': 'mod'
        }[s];
    },
    'especial': (s: string) => {
        return {
            '=': 'atr',
            '(': 'apa',
            ')': 'fpa',
            ',': 'vir',
            ':': 'dpo',
            ';': 'del'
        }[s];
    },
    'literal-int': (s: string) => '',
    'identificador': (s: string) => '',
    'sem-categoria': (s: string) => ''
}

export const getTokenSubClass = (lexema: string, classe: string) => {
    return tokenSubClass[classe as keyof typeof tokenSubClass](lexema);
}
