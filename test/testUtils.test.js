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

const e = ["b", { a: 1, b: 2 }],
  f = ["b", { a: 1, b: 2 }],
  g = [{ a: 1, b: 2 }, "b"],
  h = { b: 2, a: 1 },
  i = { a: 1, b: 2 };
test("deepArrObjEq tests object and array equality", () => {
  // First of all, all of the tests of deepArrEq will be true
  expect(testUtils.deepArrObjEq(a, [...a])).toBeTruthy();
  expect(testUtils.deepArrObjEq(a, b)).toBeFalsy();
  expect(testUtils.deepArrObjEq(c, d)).toBeFalsy();
  expect(testUtils.deepArrObjEq(c, JSON.parse(JSON.stringify(c)))).toBeTruthy();
  // Secondly, these will also be true
  expect(testUtils.deepArrObjEq(e, [...e])).toBeTruthy();
  expect(testUtils.deepArrObjEq(e, f)).toBeTruthy();
  expect(testUtils.deepArrObjEq(f, g)).toBeFalsy();
  expect(testUtils.deepArrObjEq(h, i)).toBeTruthy();
});

const obj1 = { abc: [1, 2, 3], efg: [4, 56], 123: "abc" },
  obj2 = { efg: [4, 56], abc: [1, 2, 3], 123: "abc" };
// const obj3, obj4;
test("deepArrObjEq tests nested object and arrays recursively", () => {
  expect(testUtils.deepArrObjEq(obj1, obj2)).toBeTruthy();
});
