import ttUtils from "../src/ttUtils.js";
import testUtils from "../src/testUtils.js";

let input = [
  [[0], [0]],
  [[0], [0]],
];
let expected_result = [
  [[1], [1]],
  [[1], [1]],
];
test("setTT sets inside a truth table object", () => {
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      ttUtils.setTT(input, [i, j], [1]);
    }
  expect(testUtils.deepArrEq(input, expected_result)).toBeTruthy();
});

const tt = [
  [
    [
      [
        [1, 2],
        [3, 4],
      ],
      [
        [5, 6],
        [7, 8],
      ],
    ],
    [
      [
        [9, 10],
        [11, 12],
      ],
      [
        [13, 14],
        [15, 16],
      ],
    ],
  ],
  [
    [
      [
        [17, 18],
        [19, 20],
      ],
      [
        [21, 22],
        [23, 24],
      ],
    ],
    [
      [
        [25, 26],
        [27, 28],
      ],
      [
        [29, 30],
        [31, 32],
      ],
    ],
  ],
];

test("getTT retrieves a single value from a truth table given list of input values", () => {
  for (let i = 1; i <= 16; i++) {
    // console.log([...(i - 1).toString(2).padStart(4, '0')].map((n) => parseInt(n, 2)))
    expect(
      i * 2 - 1 ===
        ttUtils.getTT(
          tt,
          [...(i - 1).toString(2).padStart(4, "0")].map((n) => parseInt(n, 2)),
        )[0],
    ).toBeTruthy();
  }
});

function test_getDimensions() {
  let tt = [
    [
      [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ],
      [
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ],
    ],
    [
      [
        [17, 18, 19, 20],
        [21, 22, 23, 24],
      ],
      [
        [25, 26, 27, 28],
        [29, 30, 31, 32],
      ],
    ],
  ];
  console.time("getDimensions");
  expect(testUtils.deepArrEq(ttUtils.getDimensions(tt), [3, 4])).toBeTruthy();
  console.timeEnd("getDimensions");
}

function runSuite() {
  test_setTT();
  test_getTT();
  test_getDimensions();
}

export default Object.freeze({
  runSuite,
});
