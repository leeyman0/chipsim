import cs from "./chipsim.js";

// An array of inputs fed into a chip should produce an array of outputs.
// First, generate the input truth table. It is a tree indexed by inputs and each leaf is an array
// of outputs. This one has two inputs and produces one output.
// it is, essentially an OR gate.
const tt = [
  [[0], [1]],
  [[1], [1]],
];
/** This is a utility function that doesn't come with javascript. Be careful with it,
 * as it doesn't come with the ability to handle circular references. The handling of
 * circular references is left as an exercise to the reader, as it is not needed for our usage.
 *
 * @param {Array} a1 the first array to compare
 * @param {Array} a2 the second array to compare
 * @returns {boolean} the result of the comparison. `true` if a1 and a2 are similar, `false` otherwise.
 * @example <caption>1. A true comparison.</caption>
 * const a = [1, 2, [3, 4, 5]];
 * const b = [...a];
 *
 * console.log(a === b); // > false
 * console.log(deepArrEq(a, b)); // > true
 *
 * @example <caption>2. false comparisons.</caption>
 * const a = [1, 2, 3];
 * const b = [1, 2, 4];
 *
 * console.log(deepArrEq(a, b)); // > false
 *
 * const c = [1, 2];
 * console.log(deepArrEq(a, c)); // > false
 * console.log(deepArrEq(c, a)); // > false
 *
 * @example <caption>3. thread hangs on circular references</caption>
 * let a = [3, 2, 1];
 * a.push(a);
 *
 * console.log(deepArrEq(a, [...a])); // Nothing will get executed past
 * // that point and a stack overflow will result.
 */
function deepArrEq(a1, a2) {
  const arrp1 = Array.isArray(a1),
    arrp2 = Array.isArray(a2);
  if (arrp1 && arrp2) {
    // both are arrays
    if (a1.length === a2.length) {
      return a1.every((e, i) => deepArrEq(e, a2[i]));
    } else return false; // a1 and a2 must be equal in size
  } else if (arrp1 || arrp2)
    return false; // mismatch in dimensionality
  else return a1 === a2; // They are both elements and should be compared as elements
}
function testDeepArrEq() {
  const a = [1, 2, 3],
    b = [1, 2, 4],
    c = [1, 2, [3, 4]],
    d = [1, 2, [4, 5]];
  console.assert(deepArrEq(a, [...a]), "deepArrEq does not work on copies");
  console.assert(!deepArrEq(a, b), "deepArrEq does not work on values within the array");
  console.assert(!deepArrEq(c, d), "deepArrEq does not work on nested arrays");
  console.assert(deepArrEq(c, JSON.parse(JSON.stringify(c))), "deepArrEq faults on identical vals");
}
testDeepArrEq();

function test_run() {
  const chip = {
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
  console.assert(cs.run(chip, [0, 0])[0] === 0, "0 xor 0 !== 0");
  console.assert(cs.run(chip, [1, 0])[0] === 1, "1 xor 0 !== 1");
  console.assert(cs.run(chip, [0, 1])[0] === 1, "0 xor 1 !== 1");
  console.assert(cs.run(chip, [1, 1])[0] === 0, "1 xor 1 !== 0");

  console.assert(deepArrEq(cs.run(right_shift, [1, 0, 0, 1, 1, 0, 0, 1, 1]), [1, 0, 0, 1, 1, 0, 0, 1]), "right shift faulty");
  console.timeEnd("run");
}
test_run();

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
  console.assert(deepArrEq(tt, cs.toTruthTable(xor)), "XOR does not generate the correct table");
  console.timeEnd("toTruthTable");
}
test_toTruthTable();

function test_fromTruthTable() {
  const tt = [
    [[0], [1]],
    [[1], [0]],
  ];
  console.time("fromTruthTable");
  console.assert(deepArrEq(tt, cs.toTruthTable(cs.fromTruthTable(tt))), "toTruthTable does not run correctly on XOR truth table.")
  console.timeEnd("fromTruthTable");
}
test_fromTruthTable();
