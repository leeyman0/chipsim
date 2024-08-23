import ttUtils from "./ttUtils.js";

function test_setTT() {
  let input = [
    [[0], [0]],
    [[0], [0]],
  ];

  let expected_result = [
    [[1], [1]],
    [[1], [1]],
  ];

  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    ttUtils.setTT(input, [i, j], [1]);
  }


}

function test_getTT() {}

function test_getDimensions() {}

function runSuite() {
  test_setTT();
  test_getTT();
  test_getDimensions();
}

export default Object.freeze({
  runSuite,
});
