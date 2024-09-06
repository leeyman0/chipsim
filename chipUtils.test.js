import chipUtils from "./chipUtils.js";
import testUtils from "./testUtils.js";
import cs from "./chipsim.js";

function test_removeUnusedGates() {
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

  console.time("removeUnusedGates");
  const gatesAllUsed = chipUtils.removeUnusedGates(chipUtils.cloneChip(unusedGates));
  console.assert(gatesAllUsed.gates.length === 2, "The unused AND gate is not eliminated.");
  console.assert(
    testUtils.deepArrEq(cs.toTruthTable(unusedGates), cs.toTruthTable(gatesAllUsed)),
    "The optimized output does not function the same as it did unoptimized.",
  );

  console.timeEnd("removeUnusedGates");
}

function test_removeDoubleNot() {
  const doubleNotGate = {
    output: [1],
    inputs: 1,
    gates: [
      {
        gate: "NOT",
        input: [-1],
      },
      {
        gate: "NOT",
        input: [0],
      },
    ],
  };

  console.time("optimizeLayout");
  const output = chipUtils.removeDoubleNot(chipUtils.cloneChip(doubleNotGate));
  console.assert(output.gates.length === 0, "Double NOT gates get removed.");
  console.assert(
    testUtils.deepArrEq(cs.toTruthTable(doubleNotGate), cs.toTruthTable(output)),
    "The optimized output does not function the same as it did unoptimized",
  );
  console.timeEnd("optimizeLayout");
}

function runSuite() {
  test_removeUnusedGates();
  test_removeDoubleNot();
}

export default Object.freeze({
  runSuite,
});
