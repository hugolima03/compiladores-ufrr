import { Grammar } from './Grammar'

// Referências
// http://www.facom.ufms.br/~ricardo/Courses/CompilerI-2009/Materials/minipascalsyntax.html
// https://condor.depaul.edu/ichu/csc447/notes/wk2/pascal.html
// http://www.irietools.com/iriepascal/progref534.html
// https://www2.seas.gwu.edu/~hchoi/teaching/cs160d/pascal.pdf
// https://www.cs.utexas.edu/users/novak/grammar.html
// https://www.freepascal.org/docs-html/ref/ref.html

const grammar = new Grammar({
    '<program>': [
        '<variable_declaration_part> <statement_part>',
        '<statement_part>'
    ],

    '<variable_declaration_part>': ['command-VAR <variable_declaration_list>'],
    '<variable_declaration_list>': [
        '<variable_declaration> <variable_declaration_list>',
        '<variable_declaration>'
    ],

    '<variable_declaration>': ['identifier symbol-colon <type> symbol-delimiter'],
    '<type>': ['name-scalar-int'],

    '<statement_part>': [
        'command-BEGIN <statement_list> command-END.',
        'command-BEGIN command-END.'
    ],

    '<statement_list>': ['<statement_list> <command>', '<command>'],
    '<command>': ['<assignment>', '<program_return>'],

    '<assignment>': ['identifier symbol-atr <return> symbol-delimiter'],

    '<program_return>': ['command-return <return> symbol-delimiter'],

    '<return>': ['<expression>'],

    '<expression>': [
        '<expression> op-aritmetico-adi <expressao_termo>',
        '<expression> op-aritmetico-sub <expressao_termo>',
        'op-aritmetico-sub <expressao_termo>',
        '<expressao_termo>'
    ],

    '<expressao_termo>': [
        '<expressao_termo> op-aritmetico-mul <expressao_fator>',
        '<expressao_termo> op-aritmetico-div <expressao_fator>',
        '<expressao_termo> op-aritmetico-mod <expressao_fator>',
        '<expressao_fator>'
    ],

    '<expressao_fator>': [
        'symbol-apa <expression> symbol-fpa',
        'identifier',
        '<literal>'
    ],

    '<literal>': ['literal-int']
}, '<vazio>');

export default grammar;
