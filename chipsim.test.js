import cs from "./chipsim.js";
import testUtils from "./testUtils.js";

function test_run() {
  const xor = {
    output: [3],
    inputs: 2,
    gates: [
      {
        gate: "AND",
        input: [-1, -2],
      },
      {
        gate: "NOT",
        input: [0],
      },
      {
        gate: "OR",
        input: [-1, -2],
      },
      {
        gate: "AND",
        input: [1, 2],
      },
    ],
  };

  let right_shift = {
    output: [-1, -2, -3, -4, -5, -6, -7, -8],
    inputs: 9,
    gates: [],
  };

  console.time("run");
  console.assert(cs.run(xor, [0, 0])[0] === 0, "0 xor 0 !== 0");
  console.assert(cs.run(xor, [1, 0])[0] === 1, "1 xor 0 !== 1");
  console.assert(cs.run(xor, [0, 1])[0] === 1, "0 xor 1 !== 1");
  console.assert(cs.run(xor, [1, 1])[0] === 0, "1 xor 1 !== 0");

  console.assert(testUtils.deepArrEq(cs.run(right_shift, [1, 0, 0, 1, 1, 0, 0, 1, 1]), [1, 0, 0, 1, 1, 0, 0, 1]), "right shift faulty");
  console.timeEnd("run");
}

function test_toTruthTable() {
  const xor = {
    output: [3],
    inputs: 2,
    gates: [
      {
        gate: "AND",
        input: [-1, -2],
      },
      {
        gate: "NOT",
        input: [0],
      },
      {
        gate: "OR",
        input: [-1, -2],
      },
      {
        gate: "AND",
        input: [1, 2],
      },
    ],
  };
  const tt = [
    [[0], [1]],
    [[1], [0]],
  ];
  console.time("toTruthTable");
  console.assert(testUtils.deepArrEq(tt, cs.toTruthTable(xor)), "XOR does not generate the correct table");
  console.timeEnd("toTruthTable");
}

function test_fromTruthTable() {
  const tt = [
    [[0], [1]],
    [[1], [0]],
  ];
  console.time("fromTruthTable");
  console.assert(testUtils.deepArrEq(tt, cs.toTruthTable(cs.fromTruthTable(tt))), "toTruthTable does not run correctly on XOR truth table.");
  console.timeEnd("fromTruthTable");
}

function runSuite() {
  test_run();
  test_toTruthTable();
  test_fromTruthTable();
}

export default Object.freeze({
  runSuite,
});
