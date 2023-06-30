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
        '<expression> op-arithmetic-adi <term_expression>',
        '<expression> op-arithmetic-sub <term_expression>',
        'op-arithmetic-sub <term_expression>',
        '<term_expression>'
    ],

    '<term_expression>': [
        '<term_expression> op-arithmetic-mul <expression_factor>',
        '<term_expression> op-arithmetic-div <expression_factor>',
        '<term_expression> op-arithmetic-mod <expression_factor>',
        '<expression_factor>'
    ],

    '<expression_factor>': [
        'symbol-apa <expression> symbol-fpa',
        'identifier',
        '<literal>'
    ],

    '<literal>': ['literal-int']
}, '<empty>');

export default grammar;
