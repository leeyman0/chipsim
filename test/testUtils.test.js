import testUtils from "../src/testUtils.js";

const a = [1, 2, 3],
  b = [1, 2, 4],
  c = [1, 2, [3, 4]],
  d = [1, 2, [4, 5]];

test("deepArrEq tests deep array equality", () => {
  expect(testUtils.deepArrEq(a, [...a])).toBeTruthy();
  expect(testUtils.deepArrEq(a, b)).toBeFalsy();
  expect(testUtils.deepArrEq(c, d)).toBeFalsy();
  expect(testUtils.deepArrEq(c, JSON.parse(JSON.stringify(c)))).toBeTruthy();
});
