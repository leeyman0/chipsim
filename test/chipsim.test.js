import cs from "../src/chipsim.js";
import testUtils from "../src/testUtils.js";

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

test("run runs an xor chip", () => {
  expect(cs.run(xor, [0, 0])[0]).toBe(0);
  expect(cs.run(xor, [1, 0])[0]).toBe(1);
  expect(cs.run(xor, [0, 1])[0]).toBe(1);
  expect(cs.run(xor, [1, 1])[0]).toBe(0);
});

let right_shift = {
  output: [-1, -2, -3, -4, -5, -6, -7, -8],
  inputs: 9,
  gates: [],
};

test("run runs a right shift", () => {
  expect(testUtils.deepArrEq(cs.run(right_shift, [1, 0, 0, 1, 1, 0, 0, 1, 1]), [1, 0, 0, 1, 1, 0, 0, 1])).toBeTruthy();
});

const tt = [
  [[0], [1]],
  [[1], [0]],
];

test("toTruthTable correctly generates the xor truth table", () => {
  expect(testUtils.deepArrEq(tt, cs.toTruthTable(xor))).toBeTruthy();
});

test("buildDemultiplexer correctly generates a 4-bit demultiplexer", () => {
  const demux4 = cs.buildDemultiplexer(4);
  for (let i = 0; i < 2 ** 4; i++) {
    // The amount that will be taken up by the preparation will be constant.
    const ip = [...i.toString(2).padStart(4, "0")].map((n) => parseInt(n, 2));
    const expectedOutput = [...new Array(i).fill(0), 1, ...new Array(15 - i).fill(0)];
    // As the model change, so does the performance of this.
    const actualOutput = cs.run(demux4, ip);
    expect(testUtils.deepArrEq(actualOutput, expectedOutput)).toBeTruthy();
  }
});
const tt_2 = [
  [
    [
      [
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0],
        [0, 0],
      ],
    ],
    [
      [
        [1, 1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, 1],
      ],
    ],
  ],
  [
    [
      [
        [1, 0],
        [0, 0],
      ],
      [
        [0, 1],
        [1, 1],
      ],
    ],
    [
      [
        [0, 0],
        [0, 1],
      ],
      [
        [1, 1],
        [1, 0],
      ],
    ],
  ],
];

test("fromTruthTable generates the same truth table as the original", () => {
  const compiledOutput = cs.fromTruthTable(tt);
  expect(testUtils.deepArrEq(tt, cs.toTruthTable(compiledOutput))).toBeTruthy();
  expect(testUtils.deepArrEq(tt_2, cs.toTruthTable(cs.fromTruthTable(tt_2)))).toBeTruthy();
});
