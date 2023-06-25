export default function ErroSemantico (atual, tipo) {
    const exc = new Error ('Erro Semântico');
    exc.detalhes = {
        atual: atual,
        tipo: tipo
    };
    return exc;
}
