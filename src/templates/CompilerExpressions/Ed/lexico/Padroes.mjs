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

padroes.matchExact = (str, regex) => {
    const m = str.match(regex);
    return m !== null && str === m[0];
}

padroes.ehEspaco = (s) => padroes.matchExact(s, padroes.espacos);

padroes.ehStringLiteral = (s) => padroes.matchExact(
    s, new RegExp('^'+padroes.stringLiteral+'$')
);

padroes.classesDeToken = {
    'nome-escalar': (s) => padroes.nomeEscalares.includes(s),
    'comando': (s) => padroes.palavras.includes(s),
    'op-aritmetico': (s) => padroes.opAritmeticos.includes(s),
    'especial': (s) => padroes.especiais.includes(s),
    'identificador': (s) => padroes.matchExact(s, padroes.identificadores),
    'literal-int': (s) => padroes.matchExact(s, padroes.intLiteral),
    'sem-categoria': (s) => true
};

padroes.descobrirTokenClasse = (lexema) => {
    return Object.keys(padroes.classesDeToken).find(
        c => padroes.classesDeToken[c](lexema)
    );
}

padroes.subclasseDeToken = {
    'nome-escalar': (s) => padroes.nomeEscalares.find(t => t === s).substr(0, 4),
    'comando': (s) => padroes.palavras.find(t => t === s).substr(0, 4),
    'op-aritmetico': (s) => {
        return {
            '+': 'adi',
            '-': 'sub',
            '*': 'mul',
            '/': 'div',
            '%': 'mod'
        }[s];
    },
    'especial': (s) => {
        return {
            '=': 'atr',
            '(': 'apa',
            ')': 'fpa',
            ',': 'vir',
            ':': 'dpo',
            ';': 'del'
        }[s];
    },
    'literal-int': (s) => '',
    'identificador': (s) => '',
    'sem-categoria': (s) => ''
}

padroes.descobrirTokenSubclasse = (lexema, classe) => {
    return padroes.subclasseDeToken[classe](lexema);
}

export default padroes;
