export default function ErroLexico (encontrado) {
    const exc = new Error ('Erro léxico');
    exc.detalhes = { encontrado: encontrado };
    return exc;
}
