export type CustomTypeError = {
    detalhes?: { nome: string; esperado: string; encontrado: string };
} & TypeError;

export default function ParametroInvalido(
    nome: string,
    esperado: string,
    encontrado: string
) {
    const exc: CustomTypeError = new TypeError(
        'O parâmetro "' +
        nome +
        '" deve ser do tipo "' +
        esperado +
        '" porém foi passado um(a) "' +
        encontrado +
        '"'
    );

    exc.detalhes = {
        nome: nome,
        esperado: esperado,
        encontrado: encontrado,
    };

    return exc;
}
