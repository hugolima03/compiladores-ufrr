import { Error } from "components/CodeEditor";

export type Token = {
  token: string;
  language: string;
};

export type State = { label: string, value: number };

export type Alphabet = { label: string, value: number }[];

export type Transition = any;

export type Automaton = {
  name: string;
  states: State[];
  alphabet: Alphabet;
  transitions: Transition;
  initialState: number;
  finalStates: number[];
};

const spacesRegex = /\s+/g; // marca os espaços no código

function checkSourceCode(
  automatons: Automaton[],
  sourceCode: string
): { data: Token[]; errors: Error[] } {
  const lines = sourceCode.split("\n");
  const sentences: string[] = [];
  const tokens: Token[] = [];
  for (let i in lines) {
    sentences.push(...lines[i].split(spacesRegex).filter((s) => s !== ""));
  }

  sentences.forEach((sentence) => {
    automatons.forEach(({ name, transitions, initialState, finalStates, alphabet }) => {
      let currentState = initialState;
      for (let i = 0; i < sentence.length; i++) {
        const char = alphabet.find(t => t.label === sentence.charAt(i))?.value;
        if (currentState !== undefined && char !== undefined) {
          currentState = transitions[char][currentState];
        } else {
          currentState = -1 // Estado de erro
        }
      }

      if (finalStates.includes(currentState)) {
        tokens.push({ token: sentence, language: name });
      }
    });
  });

  return { data: tokens, errors: [] };
}

export function useLexicalAnalyser(automatons: Automaton[]) {
  return {
    checkSourceCode: (targetString: string) =>
      checkSourceCode(automatons, targetString),
  };
}
