export const automatons = [
  {
    name: "Linguagem A",
    states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
    alphabet: ["a", "b"],
    transitions: {
      q0: { a: "q1", b: "q6" },
      q1: { a: "q2", b: "q0" },
      q2: { a: "q3", b: "q5" },
      q3: { a: "q6", b: "q4" },
      q4: { a: "q6", b: "q5" },
      q5: { a: "q6", b: "q0" },
      q6: { a: "q6", b: "q6" },
    },
    initialState: "q0",
    finalStates: ["q0"],
  },
];
