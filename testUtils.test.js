import testUtils from "./testUtils.js";

function testDeepArrEq() {
  const a = [1, 2, 3],
    b = [1, 2, 4],
    c = [1, 2, [3, 4]],
    d = [1, 2, [4, 5]];
  console.assert(testUtils.deepArrEq(a, [...a]), "deepArrEq does not work on copies");
  console.assert(!testUtils.deepArrEq(a, b), "deepArrEq does not work on values within the array");
  console.assert(!testUtils.deepArrEq(c, d), "deepArrEq does not work on nested arrays");
  console.assert(testUtils.deepArrEq(c, JSON.parse(JSON.stringify(c))), "deepArrEq faults on identical vals");
}
const runSuite = testDeepArrEq;

export default Object.freeze({
  runSuite,
});
