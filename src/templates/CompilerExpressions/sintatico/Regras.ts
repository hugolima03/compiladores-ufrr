import Gramatica from './Gramatica.mjs'

const gramatica = new Gramatica({

    // Bloco base do programa
    '<programa>': [
        '<bloco_declaracao> <bloco_principal>',
        '<bloco_principal>'
    ],

    // Bloco de declaração de variáveis
    // Padrão: "var: ..."
    '<bloco_declaracao>': ['comando-vari <lista_declaracao>'],
    '<lista_declaracao>': [
        '<declaracao> <lista_declaracao>',
        '<declaracao>'
    ],

    // Declaração de variável no padrão
    // Padrão: "nome: tipo;"
    '<declaracao>': ['identificador especial-dpo <declaracao_tipo> especial-del'],
    '<declaracao_tipo>': [ 'nome-escalar-int'],

    // Bloco de código principal
    // Padrão: "inicio ... fim"
    '<bloco_principal>': [
        'comando-inic <lista_comando> comando-fim',
        'comando-inic comando-fim'
    ],

    // Lista de comandos
    '<lista_comando>': ['<lista_comando> <comando>', '<comando>'],
    '<comando>': ['<atribuicao>', '<retorne_principal>'],

    // Atribuição
    // Padrão: var = ... ;
    '<atribuicao>': ['identificador especial-atr <retorno_valor> especial-del'],

    // Retorno de valor e encerramento
    // Padrão: retorne ... ;
    '<retorne_principal>': ['comando-reto <retorno_valor> especial-del'],

    '<retorno_valor>': ['<expressao>'],

    // Expressão aritmetica para soma e subtração
    // Padrões:
    // ... + ...
    // ... - ...
    // - ...
    '<expressao>': [
        '<expressao> op-aritmetico-adi <expressao_termo>',
        '<expressao> op-aritmetico-sub <expressao_termo>',
        'op-aritmetico-sub <expressao_termo>',
        '<expressao_termo>'
    ],

    // Expressão aritmetica para multiplicação e divisão
    // Padrões:
    // ... * ...
    // ... / ...
    // ... % ...
    '<expressao_termo>': [
        '<expressao_termo> op-aritmetico-mul <expressao_fator>',
        '<expressao_termo> op-aritmetico-div <expressao_fator>',
        '<expressao_termo> op-aritmetico-mod <expressao_fator>',
        '<expressao_fator>'
    ],

    // Valores para as expressões aritmeticas
    // Padrões:
    // ... ( ... ) ...
    // ... var ...
    // ... literal ...
    '<expressao_fator>': [
        'especial-apa <expressao> especial-fpa',
        'identificador',
        '<literal>'
    ],

    // Valores liteais
    '<literal>': [ 'literal-int' ]

}, '<vazio>');

export default gramatica;
