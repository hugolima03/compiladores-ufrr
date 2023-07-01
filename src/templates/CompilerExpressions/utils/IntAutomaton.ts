export type Automaton = {
  name: string;
  states: { label: string; value: number }[];
  alphabet: { label: string; value: number }[];
  transitions: number[][];
  initialState: number;
  finalStates: number[];
};

export const reconizeSentence = (sentence: string, automaton: Automaton): boolean => {
  let currentState = automaton.initialState;
  for (let i = 0; i < sentence.length; i++) {
      const char = automaton.alphabet.find(
          (t) => t.label === sentence.charAt(i)
      )?.value;
      if (currentState !== undefined && char !== undefined) {
          currentState = automaton.transitions[char][currentState];
      } else {
          currentState = -1; // Estado de erro
      }
  }
  if (automaton.finalStates.includes(currentState)) {
      return true;
  }
  return false;
};

export const intAutomaton = {
  name: "literal-int",
  states: [
      { label: "q0", value: 0 },
      { label: "q1", value: 1 },
      { label: "q2", value: 2 },
  ],
  alphabet: [
      { label: "0", value: 0 },
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
  ],
  transitions: [
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
      [1, 1, 2],
  ],
  initialState: 0,
  finalStates: [1],
};
