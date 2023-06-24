type Token = {
  _classe: string
  _lexemas: Lexema[]
  _subclass: string
}

export const useToken = () => {
  function createToken(tokenClass: string, tokenSubClass: string) {
    const lexemes: string[] = []

    function type() {
      return tokenClass + (tokenSubClass !== '' ? '-' + tokenSubClass : '');
    }

    function appendLexeme(lexeme: string) {
      if (!lexemes.includes(lexeme)) lexemes.push(lexeme);
    }

    return { lexemes, tokenClass, tokenSubClass, type, appendLexeme }
  }

  return { createToken }
}