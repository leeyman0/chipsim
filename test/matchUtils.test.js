import mu from "../src/matchUtils.js";
import tu from "../src/testUtils.js";

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
  expect(tu.deepArrEq(mu.matchChip(null, "doesn't matter"), [])).toBeTruthy();
});

test("matchChip doesn't accept a bad precededByN", () => {
  console.info("Testing on bad precededByN argument. ↓ There should be 2 error notifications below that the precededByN option is a bad argument");
  expect(tu.deepArrEq(mu.matchChip(gateMap, { precededByN: "This is the first" }), [])).toBeTruthy();
  expect(tu.deepArrEq(mu.matchChip(gateMap, { precededByN: -2 }), [])).toBeTruthy();
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
      expect(tu.deepArrEq(allGatesMatch, mu.matchChip(gateMap, { gate: gateOption }))).toBeTruthy();
    } else {
      // Gate specification behavior.
      let correct = gateMap.gates.flatMap(({ gate }, i) => (gate === gateOption ? [i] : []));
      expect(tu.deepArrEq(correct, mu.matchChip(gateMap, { gate: gateOption }))).toBeTruthy();
    }
  });
});

test("matchChip precededBy option match the gates that are preceded by the specified gate", () => {
  expect(tu.deepArrEq([2, 3, 6], mu.matchChip(gateMap, { gate: "OR", precededBy: "*" }))).toBeTruthy();
  expect(tu.deepArrEq([6], mu.matchChip(gateMap, { gate: "OR", precededBy: "OR" }))).toBeTruthy();
  expect(tu.deepArrEq([2, 6], mu.matchChip(gateMap, { gate: "OR", precededBy: "AND" }))).toBeTruthy();
});

test("matchChip precededByN option matches the correct number of gates", () => {
  expect(tu.deepArrEq(mu.matchChip(gateMap, { gate: "NOT" }), mu.matchChip(gateMap, { precededByN: 1 }))).toBeTruthy();
});

test("matchChip followedBy option matches the gates that are followed by the specified gate", () => {
  expect(tu.deepArrEq([1, 4, 7], mu.matchChip(gateMap, { gate: "AND", followedBy: "*" }))).toBeTruthy();
  expect(tu.deepArrEq([1, 4], mu.matchChip(gateMap, { gate: "AND", followedBy: "OR" }))).toBeTruthy();
  expect(tu.deepArrEq([0], mu.matchChip(gateMap, { gate: "NOT", followedBy: "OR" }))).toBeTruthy();
  expect(tu.deepArrEq([2, 3, 6], mu.matchChip(gateMap, { gate: "OR", followedBy: "AND" }))).toBeTruthy();
});

test("matchChip followedByN option matches the gates that are preceded by the specified number of gates", () => {
  expect(tu.deepArrEq([], mu.matchChip(gateMap, { gate: "NOT", followedByN: 2 }))).toBeTruthy();
  expect(tu.deepArrEq([0, 5], mu.matchChip(gateMap, { gate: "NOT", followedByN: 1 }))).toBeTruthy();
  expect(tu.deepArrEq([], mu.matchChip(gateMap, { gate: "NOT", followedByN: 0 }))).toBeTruthy();
});

test("matchChip capture.precedingIndex set to true captures the index that the root index is preceded by for each match", () => {
  expect(
    tu.deepArrObjEq(
      [{ precedingIndex: [1] }, { precedingIndex: [4] }],
      mu.matchChip(gateMap, { gate: "OR", precededBy: "AND", capture: { precedingIndex: true, rootIndex: false } }),
    ),
  ).toBeTruthy();
});

test("matchChip capture.beforePrecedingIndex set to true captures the indices that feed into the preceding index", () => {
  expect(
    tu.deepArrObjEq(
      [
        { precedingIndex: [1], beforePrecedingIndex: [-2, -1] },
        { precedingIndex: [4], beforePrecedingIndex: [2, 3] },
      ],
      mu.matchChip(gateMap, { gate: "OR", precededBy: "AND", capture: { precedingIndex: true, rootIndex: false, beforePrecedingIndex: true } }),
    ),
  );
});

// function test_matchGate_capture() {
//   console.time("matchGate capture and collection");
//   // Specification capture. If capture is not defined, it will return an array of root gate indices.
//   // If it is defined, then a match object takes the place of the indices of the roots. It will have much more information like:
//   // - the indices of the preceding gates. Or the gate in the query.
//   // - the indices of following gates. Or the gate in the query.
//   // - the indices of the gates after the following gates if the match requires the following gate.
//   // - the indices of the gates leading into the gate leading into the root gate if the match requires the previous gate to the root.

//   console.log(
//     mu.matchChip(gateMap, {
//       gate: "OR",
//       precededBy: "NOT",
//       capture: {
//         rootIndex: true,
//         precedingIndex: true,
//       },
//     }),
//   );

//   console.log(
//     mu.matchChip(gateMap, {
//       gate: "NOT",
//       followedByN: 1,
//       followedBy: "NOT",
//       capture: {
//         afterFollowingIndex: true,
//         precedingIndex: true,
//       },
//       flags: {
//         exclusive: true,
//       },
//     }),
//   );

//   console.timeEnd("matchGate capture and collection");
// }

// function test_matchGate_flags() {
//   console.time("matchGate flag exclusive");
//   // This flag being set means that all captures are exclusive of each other.
//   console.timeEnd("matchGate flag exclusive");
// }
