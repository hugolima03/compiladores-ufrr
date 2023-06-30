import { Grammar } from './Grammar'

// Referências
// http://www.facom.ufms.br/~ricardo/Courses/CompilerI-2009/Materials/minipascalsyntax.html
// https://condor.depaul.edu/ichu/csc447/notes/wk2/pascal.html
// http://www.irietools.com/iriepascal/progref534.html
// https://www2.seas.gwu.edu/~hchoi/teaching/cs160d/pascal.pdf
// https://www.cs.utexas.edu/users/novak/grammar.html
// https://www.freepascal.org/docs-html/ref/ref.html

const grammar = new Grammar({

    // Bloco base do programa
    '<program>': [
        '<variable_declaration_part> <statement_part>',
        '<statement_part>'
    ],

    // Bloco de declaração de variáveis
    // Padrão: "var: ..."
    '<variable_declaration_part>': ['command-VAR <variable_declaration_list>'],
    '<variable_declaration_list>': [
        '<variable_declaration> <variable_declaration_list>',
        '<variable_declaration>'
    ],

    // Declaração de variável no padrão
    // Padrão: "nome: tipo;"
    '<variable_declaration>': ['identifier symbol-colon <type> symbol-delimiter'],
    '<type>': ['name-scalar-int'],

    // Bloco de código principal
    // Padrão: "inicio ... fim"
    '<statement_part>': [
        'command-BEGIN <lista_comando> command-END.',
        'command-BEGIN command-END.'
    ],

    // Lista de comandos
    '<lista_comando>': ['<lista_comando> <comando>', '<comando>'],
    '<comando>': ['<atribuicao>', '<retorne_principal>'],

    // Atribuição
    // Padrão: var = ... ;
    '<atribuicao>': ['identifier symbol-atr <retorno_valor> symbol-delimiter'],

    // Retorno de valor e encerramento
    // Padrão: retorne ... ;
    '<retorne_principal>': ['command-return <retorno_valor> symbol-delimiter'],

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
        'symbol-apa <expressao> symbol-fpa',
        'identifier',
        '<literal>'
    ],

    // Valores liteais
    '<literal>': ['literal-int']

}, '<vazio>');

export default grammar;
