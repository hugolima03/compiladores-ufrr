import Lexema from "../lexico/Lexema";

export type CustomError = { detalhes?: { encontrado: Lexema } } & Error

export default function ErroLexico(encontrado: Lexema) {
    const exc: CustomError = new Error('Erro léxico');
    exc.detalhes = { encontrado: encontrado };
    return exc;
}
