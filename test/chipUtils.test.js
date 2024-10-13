import chipUtils from "../src/chipUtils.js";
import testUtils from "../src/testUtils.js";
import cs from "../src/chipsim.js";
const unusedGates = {
  output: [2],
  inputs: 2,
  gates: [
    {
      gate: "AND",
      input: [-1, -2],
    },
    {
      gate: "OR",
      input: [-1, -2],
    },
    {
      gate: "NOT",
      input: [1],
    },
  ],
};

test("removeUnusedGates tracks and removes gates without affecting the proper functioning of a chip", () => {
  const gatesAllUsed = chipUtils.removeUnusedGates(chipUtils.cloneChip(unusedGates));
  expect(gatesAllUsed.gates.length === 2).toBeTruthy();
  expect(testUtils.deepArrEq(cs.toTruthTable(unusedGates), cs.toTruthTable(gatesAllUsed))).toBeTruthy();
});

// function test_removeDoubleNot() {
//   const doubleNotGate = {
//     output: [1],
//     inputs: 1,
//     gates: [
//       {
//         gate: "NOT",
//         input: [-1],
//       },
//       {
//         gate: "NOT",
//         input: [0],
//       },
//     ],
//   };
//   console.time("optimizeLayout");
//   const output = chipUtils.removeDoubleNot(chipUtils.cloneChip(doubleNotGate));
//   expect(output.gates.length === 0).toBeTruthy();
//   console.assert(
//     testUtils.deepArrEq(cs.toTruthTable(doubleNotGate), cs.toTruthTable(output)),
//     "The optimized output does not function the same as it did unoptimized",
//   );
//   console.timeEnd("optimizeLayout");
// }
