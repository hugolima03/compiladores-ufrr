import { Error } from "components/CodeEditor";

export type Token = {
  token: string;
  language: string;
};

export type State = string;

export type Alphabet = string[];

export type Transition = any;

export type Automaton = {
  name: string;
  states: State[];
  alphabet: Alphabet;
  transitions: Transition;
  initialState: State;
  finalStates: State[];
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
    automatons.forEach(({ name, transitions, initialState, finalStates }) => {
      let currentState = initialState;
      for (let i = 0; i < sentence.length; i++) {
        const char = sentence.charAt(i);
        if (currentState !== undefined) {
          currentState = transitions[currentState][char];
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
