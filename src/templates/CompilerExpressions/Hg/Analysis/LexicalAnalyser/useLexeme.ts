export const useToken = () => {
  function createToken(palavra: string, linha: number, coluna: number, token: string) {
    return { palavra, linha, coluna, token }
  }

  return { createToken }
}
