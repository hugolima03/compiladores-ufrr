export default function ErroGramatical (encontrado) {
    const exc = new Error ('Erro sintático');
    exc.detalhes = { encontrado: encontrado };
    return exc;
}
