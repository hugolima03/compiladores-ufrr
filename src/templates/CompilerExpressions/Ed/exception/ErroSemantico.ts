type CustomError = { detalhes?: { atual: string, tipo: string } } & Error

export default function ErroSemantico(atual: string, tipo: string) {
    const exc: CustomError = new Error('Erro Semântico');
    exc.detalhes = {
        atual: atual,
        tipo: tipo
    };
    return exc;
}
