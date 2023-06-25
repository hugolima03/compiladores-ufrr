const padroes = {

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

export const ehEspaco = (s: string) => matchExact(s, padroes.espacos);

export const ehStringLiteral = (s: string) => matchExact(
    s, new RegExp('^' + padroes.stringLiteral + '$')
);

export const classesDeToken = {
    'nome-escalar': (s: string) => padroes.nomeEscalares.includes(s),
    'comando': (s: string) => padroes.palavras.includes(s),
    'op-aritmetico': (s: string) => padroes.opAritmeticos.includes(s),
    'especial': (s: string) => padroes.especiais.includes(s),
    'identificador': (s: string) => matchExact(s, padroes.identificadores),
    'literal-int': (s: string) => matchExact(s, padroes.intLiteral),
    'sem-categoria': (s: string) => true
};

export const descobrirTokenClasse = (lexema: string) => {
    return Object.keys(classesDeToken).find(
        c => classesDeToken[c as keyof typeof classesDeToken](lexema)
    );
}

export const subclasseDeToken = {
    'nome-escalar': (s: string) => padroes.nomeEscalares.find(t => t === s)?.substr(0, 4),
    'comando': (s: string) => padroes.palavras.find(t => t === s)?.substr(0, 4),
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

export const descobrirTokenSubclasse = (lexema: string, classe: string) => {
    return subclasseDeToken[classe as keyof typeof subclasseDeToken](lexema);
}

export default padroes;
