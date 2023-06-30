import { Lexeme } from "../pipeline1/Lexeme";
import { CustomError } from "./ErroSemantico";

export default function ErroGramatical(encontrado: Lexeme) {
    const exc: CustomError = new Error('Erro sintático');
    exc.message = `Erro léxico! Linha ${encontrado._linha + 1} coluna ${encontrado._coluna + 1}`;
    return exc;
}
