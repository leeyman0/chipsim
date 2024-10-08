import mu from "./matchUtils.js";
import tu from "./testUtils.js";

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

function test_matchGate() {
  console.time("matchChip argument failure");
  console.info("Testing on no chip. ↓ There should be an error notification below that the chip argument is not a chip.");
  console.assert(tu.deepArrEq(mu.matchChip(null, "doesn't matter"), []), "match chip called with no chip should return an empty array.");
  console.info("Testing on bad precededByN argument. ↓ There should be 2 error notifications below that the precededByN option is a bad argument");
  console.assert(
    tu.deepArrEq(mu.matchChip(gateMap, { precededByN: "This is the first" }), []),
    "match chip called with precededByN=Some other string should return an empty array.",
  );
  console.assert(tu.deepArrEq(mu.matchChip(gateMap, { precededByN: -2 }), []), "match chip called with precededByN=-2 should return an empty array.");
  console.timeEnd("matchChip argument failure");

  // Building the set of all gate indices. Helpful for testing.
  let allGatesMatch = [];
  for (let i = 0; i < gateMap.gates.length; i++) {
    allGatesMatch.push(i); // This is so dumb. Why oh why does JS have no range operator?
  }

  console.time("matchChip gate option");
  // Tests all of the gate options.
  ["NOT", "AND", "OR", "*", undefined].forEach((gateOption) => {
    if (gateOption === undefined || gateOption === "*") {
      // Default and wildcard behavior.
      console.time("matchChip gate options " + gateOption);
      console.assert(tu.deepArrEq(allGatesMatch, mu.matchChip(gateMap, { gate: gateOption })), "matchChip gate ", gateOption, " is faulty");
      console.timeEnd("matchChip gate options " + gateOption);
    } else {
      // Gate specification behavior.
      let correct = gateMap.gates.flatMap(({ gate }, i) => (gate === gateOption ? [i] : []));
      console.time("matchChip gate options " + gateOption);
      console.assert(tu.deepArrEq(correct, mu.matchChip(gateMap, { gate: gateOption })), "matchChip gate ", gateOption, " is faulty");
      console.timeEnd("matchChip gate options " + gateOption);
    }
  });
  console.timeEnd("matchChip gate option");

  console.time("matchChip precededBy option");
  // test the precededBy options
  console.assert(tu.deepArrEq([2, 3, 6], mu.matchChip(gateMap, { gate: "OR", precededBy: "*" })), "matchChip OR precededBy * is faulty");
  console.assert(tu.deepArrEq([6], mu.matchChip(gateMap, { gate: "OR", precededBy: "OR" })), "matchChip OR precededBy OR is faulty");
  console.assert(tu.deepArrEq([2, 6], mu.matchChip(gateMap, { gate: "OR", precededBy: "AND" })), "matchChip OR precededBy AND is faulty");
  console.timeEnd("matchChip precededBy option");

  console.time("matchChip precededByN option");
  // test the precededByN options
  console.assert(tu.deepArrEq(mu.matchChip(gateMap, { gate: "NOT" }), mu.matchChip(gateMap, { precededByN: 1 })), "matchChip precededByN is faulty");
  console.timeEnd("matchChip precededByN option");
}

function test_matchGate_followedBy() {
  console.time("matchChip followedBy option");
  console.assert(tu.deepArrEq([1, 4, 7], mu.matchChip(gateMap, { gate: "AND", followedBy: "*" })), "matchChip AND followedBy * is faulty");
  console.assert(tu.deepArrEq([1, 4], mu.matchChip(gateMap, { gate: "AND", followedBy: "OR" })), "matchChip AND followedBy OR is faulty");
  console.assert(tu.deepArrEq([0], mu.matchChip(gateMap, { gate: "NOT", followedBy: "OR" })), "matchChip NOT followedBy OR is faulty");
  console.assert(tu.deepArrEq([2, 3, 6], mu.matchChip(gateMap, { gate: "OR", followedBy: "AND" })), "matchChip OR followedBy AND is faulty");
  console.timeEnd("matchChip followedBy option");
  console.time("matchChip followedByN option");
  console.assert(tu.deepArrEq([], mu.matchChip(gateMap, { gate: "NOT", followedByN: 2 })), "matchChip NOT followedByN 2 is faulty");
  console.assert(tu.deepArrEq([0, 5], mu.matchChip(gateMap, { gate: "NOT", followedByN: 1 })), "matchChip NOT followedBy 1 is faulty");
  console.assert(tu.deepArrEq([], mu.matchChip(gateMap, { gate: "NOT", followedByN: 0 })), "matchChip NOT followedByN 0 is faulty");
  console.timeEnd("matchChip followedByN option");
}

function runSuite() {
  test_matchGate();
  test_matchGate_followedBy();
}

export default Object.freeze({
  runSuite,
});
