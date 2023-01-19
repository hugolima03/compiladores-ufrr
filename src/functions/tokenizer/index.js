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
    primitiveType: (l) =>
      l.match(new RegExp("^" + primitiveTypes.join("|") + "$")) != null,
    keyWord: (l) => l.match(new RegExp("^" + keyWords.join("|") + "$")) != null,
    boolLiteral: (l) =>
      l.match(new RegExp("^" + boolLiterals.join("|") + "$")) != null,
    arithmeticOperators: (l) =>
      l.match(new RegExp("^\\" + arithmeticOperators.join("|\\") + "$")) !=
      null,
    grouper: (l) =>
      l.match(new RegExp("^\\" + groupers.join("|\\") + "$")) != null,
    id: (l) => l.match(idRegex) != null,
    literalStr: (l) => l.match(new RegExp("^" + strPattern + "$")) != null,
    numI: (l) => l.match(numIRegex) != null,
    numF: (l) => l.match(numFRegex) != null,
    undefined: (l) => true,
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
  ); // este regex marca todos os símbolos considerados separadores.

  const frags = splitSpaces(line);
  const lexemes = [];

  for (let i in frags) {
    const matched = [...frags[i].matchAll(regex)];
    let cursor = 0;

    for (let j in matched) {
      const sep = matched[j][0];
      const left = frags[i].substr(cursor, matched[j]["index"] - cursor);

      if (left.length > 0) lexemes.push({ lexeme: left });
      lexemes.push({ lexeme: sep });

      cursor = matched[j]["index"] + sep.length;
    }

    if (cursor < frags[i].length) {
      lexemes.push({ lexeme: frags[i].substr(cursor) });
    }
  }

  return lexemes;
}

export function tokenizer(line) {
  const lexemes = parseLexemes(line);

  for (let i in lexemes) {
    const cat = matchLexemeCategory(lexemes[i].lexeme);
    lexemes[i].label = cat;

    if (cat === "undefined") {
      console.log('Invalid identifier "' + lexemes[i] + '" at line ' + line);
    }
  }

  return lexemes;
}
