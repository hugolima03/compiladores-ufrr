export default function ParametroInvalido (nome, esperado, encontrado) {

    const exc = new TypeError (
        'O parâmetro "'+ nome + '" deve ser do tipo "'+ esperado +
        '" porém foi passado um(a) "'+ encontrado + '"'
    );

    exc.detalhes = {
        nome: nome,
        esperado: esperado,
        encontrado: encontrado
    }

    return exc;
}
