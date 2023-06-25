export type CustomError = { detalhes?: { encontrado: string } } & Error

export default function ErroGramatical(encontrado: string) {
    const exc: CustomError = new Error('Erro sintático');
    exc.detalhes = { encontrado: encontrado };
    return exc;
}
