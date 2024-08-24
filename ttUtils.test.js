import ttUtils from "./ttUtils.js";
import testUtils from "./testUtils.js";

function test_setTT() {
  let input = [
    [[0], [0]],
    [[0], [0]],
  ];

  let expected_result = [
    [[1], [1]],
    [[1], [1]],
  ];

  console.time("setTT");
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      ttUtils.setTT(input, [i, j], [1]);
    }
  console.assert(testUtils.deepArrEq(input, expected_result), "setTT doesn't work");
  console.timeEnd("setTT");
}

function test_getTT() {
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

  console.time("getTT");
  for (let i = 1; i <= 16; i++) {
    // console.log([...(i - 1).toString(2).padStart(4, '0')].map((n) => parseInt(n, 2)))
    console.assert(
      i * 2 - 1 ===
        ttUtils.getTT(
          tt,
          [...(i - 1).toString(2).padStart(4, "0")].map((n) => parseInt(n, 2)),
        )[0],
      `getTT failed on ${i}`,
    );
  }
  console.timeEnd("getTT");
}

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
  console.assert(testUtils.deepArrEq(ttUtils.getDimensions(tt), [3, 4]), "")
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
