export type CustomError = {
  message?: string;
} & Error;

export default function ErroSemantico(atual: any, tipo: string) {
  const exc: CustomError = new Error("Erro Semântico");
  exc.message = `${tipo}. Linha ${atual._linha + 1} coluna ${atual._coluna + 1}`;
  return exc;
}
