// REGEX
const spacesRegex = /\s+/g; // marca os espaços no código
const idRegex = /^[a-zA-Z\_][a-zA-Z\_0-9]*$/;
const numIRegex = /^[0-9]+$/;
const numFRegex = /^(([0-9]+(\.[0-9]+))|(\.[0-9]+))$/;
const strPattern = /\'(.*?)\'/; // utilizado para identificar cadeias de strings no código

// LEXEMAS
const boolLiterals = ["true", "false"];
const keyWords = ["if", "else", "while", "let"];
const arithmeticOperators = ["+", "-", "*", "/", "%", "="];
const groupers = ["(", ")", "[", "]", "{", "}", ",", ";"];
const primitiveTypes = ["int", "float", "string", "bool"];

function matchLexemeCategory(lexeme) {
  const categories = {
    primitiveType: (lexeme) =>
      lexeme.match(new RegExp("^" + primitiveTypes.join("|") + "$")) != null,
    keyWord: (lexeme) => lexeme.match(new RegExp("^" + keyWords.join("|") + "$")) != null,
    boolLiteral: (lexeme) =>
      lexeme.match(new RegExp("^" + boolLiterals.join("|") + "$")) != null,
    arithmeticOperators: (lexeme) =>
      lexeme.match(new RegExp("^\\" + arithmeticOperators.join("|\\") + "$")) !=
      null,
    grouper: (lexeme) =>
      lexeme.match(new RegExp("^\\" + groupers.join("|\\") + "$")) != null,
    id: (lexeme) => lexeme.match(idRegex) != null,
    literalStr: (lexeme) => lexeme.match(new RegExp(strPattern)) != null,
    numI: (lexeme) => lexeme.match(numIRegex) != null,
    numF: (lexeme) => lexeme.match(numFRegex) != null,
    undefined: (lexeme) => true,
  };

  for (let i in categories) {
    if (!categories.hasOwnProperty(i)) continue;
    if (!categories[i](lexeme)) continue;
    return i;
  }
}

function splitSpaces(input) {
  const strRegex = new RegExp(strPattern, "g");
  const strs = [...input.matchAll(strRegex)];
  let frags = [];
  let cursor = 0;

  for (let i in strs) {
    const s = strs[i];
    const left = input.substr(cursor, s["index"] - cursor).trim();

    frags = [...frags, ...left.split(spacesRegex), s[0]];

    cursor = s["index"] + s[0].length;
  }

  if (cursor < input.length) {
    frags = [...frags, ...input.substr(cursor).trim().split(spacesRegex)];
  }

  return frags;
}

function parseLexemes(line) {
  const separators = [...arithmeticOperators, ...groupers];
  const regex = new RegExp(
    "[\\" + separators.join("\\") + "]|" + strPattern,
    "g"
  );
  const frags = splitSpaces(line); //  ["let", "x", "=", "y", "+", "1;"]
  const lexemes = [];

  frags.forEach((frag) => {
    const matched = [...frag.matchAll(regex)];
    let cursor = 0;

    matched.forEach((matchedFrag) => {
      const separator = matchedFrag[0]
      const leftChar = frag.substr(cursor, matchedFrag["index"] - cursor);
      if (leftChar.length > 0) { lexemes.push({ lexeme: leftChar }) };
      lexemes.push({ lexeme: separator });
      cursor = matchedFrag["index"] + separator.length;
    })

    if (cursor < frag.length) {
      lexemes.push({ lexeme: frag.substr(cursor) });
    }
  })

  return lexemes;
}

export function tokenizer(line) {
  const lexemes = parseLexemes(line);

  return lexemes.map(({ lexeme }) => {
    const cat = matchLexemeCategory(lexeme);

    if (cat === "undefined") {
      console.log('Invalid identifier "' + lexeme + '" at line ' + line);
    }

    return { lexeme, label: cat }
  })
}
