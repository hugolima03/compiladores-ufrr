export const usePatterns = () => {
  const patterns = {
    arithmeticOperators: ["+", "-", "*", "/", "%"],
    special: ["=", "(", ")", ",", ":", ";"],

    scalarName: ["int"],
    words: ["variaveis", "inicio", "fim", "retorne"],

    stringLiteral: "([\"'])(?:(?=(\\\\?))\\2.)*?\\1",
    intLiteral: /^[1-9][0-9]*|0([1-7][0-7]*|x[0-9a-zA-Z]+)?$/,
    identifiers: /^[a-zA-Z\_][a-zA-Z\_0-9]*$/,

    spaces: /\s+/g,
    EOL: /\r?\n/,
  };

  const tokenClasses = {
    "nome-escalar": (str: string) => patterns.scalarName.includes(str),
    comando: (str: string) => patterns.words.includes(str),
    "op-aritmetico": (str: string) =>
      patterns.arithmeticOperators.includes(str),
    especial: (str: string) => patterns.special.includes(str),
    identificador: (str: string) => matchExact(str, patterns.identifiers),
    "literal-int": (str: string) => matchExact(str, patterns.intLiteral),
    "sem-categoria": (str: string) => true,
  };

  // TODO saber isso aqui
  const subclasseDeToken = {
    "nome-escalar": (str: string) =>
      patterns.scalarName.find((t) => t === str)?.substr(0, 4),
    comando: (str: string) =>
      patterns.words.find((t) => t === str)?.substr(0, 4),
    "op-aritmetico": (str: string) => {
      return {
        "+": "adi",
        "-": "sub",
        "*": "mul",
        "/": "div",
        "%": "mod",
      }[str];
    },
    especial: (str: string) => {
      return {
        "=": "atr",
        "(": "apa",
        ")": "fpa",
        ",": "vir",
        ":": "dpo",
        ";": "del",
      }[str];
    },
    "literal-int": (str: string) => "",
    identificador: (str: string) => "",
    "sem-categoria": (str: string) => "",
  };

  function matchExact(str: string, regex: RegExp) {
    const m = str.match(regex);
    return m !== null && str === m[0];
  }

  function isSpace(str: string) {
    matchExact(str, patterns.spaces);
  }

  function isLiteralString(str: string) {
    matchExact(str, new RegExp("^" + patterns.stringLiteral + "$"));
  }

  function getTokenClass(lexeme: string) {
    return Object.keys(tokenClasses).find((c) =>
      tokenClasses[c as keyof typeof tokenClasses](lexeme)
    );
  }

  function findTokenSubClass(lexema: string, classe: string) {
    return subclasseDeToken[classe as keyof typeof subclasseDeToken](lexema);
  }

  return {
    patterns,
    tokenClasses,
    subclasseDeToken,
    matchExact,
    isSpace,
    isLiteralString,
    getTokenClass,
    findTokenSubClass,
  };
};
