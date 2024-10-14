import mu from "../src/matchUtils.js";

// Should match all the gates
const gateMap = {
  inputs: 3,
  output: [7],
  gates: [
    {
      // 0
      gate: "NOT",
      input: [-1],
    },
    {
      // 1
      gate: "AND",
      input: [-1, -2],
    },
    {
      // 2
      gate: "OR",
      input: [0, 1],
    },
    {
      // 3
      gate: "OR",
      input: [-2, -3],
    },
    {
      // 4
      gate: "AND",
      input: [2, 3],
    },
    {
      // 5
      gate: "NOT",
      input: [-3],
    },
    {
      // 6
      gate: "OR",
      input: [3, 4],
    },
    {
      // 7
      gate: "AND",
      input: [5, 6],
    },
  ],
};
test("matchChip doesn't accept bad chips", () => {
  console.info("Testing on no chip. ↓ There should be an error notification below that the chip argument is not a chip.");
  expect(mu.matchChip(null, "doesn't matter")).toEqual([]);
});

test("matchChip doesn't accept a bad precededByN", () => {
  console.info("Testing on bad precededByN argument. ↓ There should be 2 error notifications below that the precededByN option is a bad argument");
  expect(mu.matchChip(gateMap, { precededByN: "This is the first" })).toEqual([]);
  expect(mu.matchChip(gateMap, { precededByN: -2 })).toEqual([]);
});

// Building the set of all gate indices. Helpful for testing.
let allGatesMatch = [];
for (let i = 0; i < gateMap.gates.length; i++) {
  allGatesMatch.push(i); // This is so dumb. Why oh why does JS have no range operator?
}

test("matchChip gate options match on the correct gates", () => {
  // Tests all of the gate options.
  ["NOT", "AND", "OR", "*", undefined].forEach((gateOption) => {
    if (gateOption === undefined || gateOption === "*") {
      // Default and wildcard behavior.
      expect(mu.matchChip(gateMap, { gate: gateOption })).toEqual(allGatesMatch);
    } else {
      // Gate specification behavior.
      let correct = gateMap.gates.flatMap(({ gate }, i) => (gate === gateOption ? [i] : []));
      expect(mu.matchChip(gateMap, { gate: gateOption })).toEqual(correct);
    }
  });
});

test("matchChip precededBy option match the gates that are preceded by the specified gate", () => {
  expect(mu.matchChip(gateMap, { gate: "OR", precededBy: "*" })).toEqual([2, 3, 6]);
  expect(mu.matchChip(gateMap, { gate: "OR", precededBy: "OR" })).toEqual([6]);
  expect(mu.matchChip(gateMap, { gate: "OR", precededBy: "AND" })).toEqual([2, 6]);
});

test("matchChip precededByN option matches the correct number of gates", () => {
  expect(mu.matchChip(gateMap, { gate: "NOT" })).toEqual(mu.matchChip(gateMap, { precededByN: 1 }));
});

test("matchChip followedBy option matches the gates that are followed by the specified gate", () => {
  expect(mu.matchChip(gateMap, { gate: "AND", followedBy: "*" })).toEqual([1, 4, 7]);
  expect(mu.matchChip(gateMap, { gate: "AND", followedBy: "OR" })).toEqual([1, 4]);
  expect(mu.matchChip(gateMap, { gate: "NOT", followedBy: "OR" })).toEqual([0]);
  expect(mu.matchChip(gateMap, { gate: "OR", followedBy: "AND" })).toEqual([2, 3, 6]);
});

test("matchChip followedByN option matches the gates that are preceded by the specified number of gates", () => {
  expect(mu.matchChip(gateMap, { gate: "NOT", followedByN: 2 })).toEqual([]);
  expect(mu.matchChip(gateMap, { gate: "NOT", followedByN: 1 })).toEqual([0, 5]);
  expect(mu.matchChip(gateMap, { gate: "NOT", followedByN: 0 })).toEqual([]);
});

// Specification capture. If capture is not defined, it will return an array of root gate indices.
// If it is defined, then a match object takes the place of the indices of the roots. It will have much more information like:
// - the indices of the preceding gates. Or the gate in the query.
// - the indices of following gates. Or the gate in the query.
// - the indices of the gates after the following gates if the match requires the following gate.
// - the indices of the gates leading into the gate leading into the root gate if the match requires the previous gate to the root.
test("matchChip capture.precedingIndex set to true captures the index that the root index is preceded by for each match", () => {
  expect(mu.matchChip(gateMap, { gate: "OR", precededBy: "AND", capture: { precedingIndex: true, rootIndex: false } })).toEqual([
    { precedingIndex: [1] },
    { precedingIndex: [4] },
  ]);
});

test("matchChip capture.beforePrecedingIndex set to true captures the indices that feed into the preceding index", () => {
  expect(mu.matchChip(gateMap, { gate: "OR", precededBy: "AND", capture: { precedingIndex: true, rootIndex: false, beforePrecedingIndex: true } })).toEqual([
    { precedingIndex: [1], beforePrecedingIndex: [-2, -1] },
    { precedingIndex: [4], beforePrecedingIndex: [2, 3] },
  ]);
});

// function test_matchGate_flags() {
//   console.time("matchGate flag exclusive");
//   // This flag being set means that all captures are exclusive of each other.
//   console.timeEnd("matchGate flag exclusive");
// }
