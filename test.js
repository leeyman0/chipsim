import ttUtilsTest from "./ttUtils.test.js";
import testUtilsTest from "./testUtils.test.js";
import chipsimTest from "./chipsim.test.js";

let testSuites = [testUtilsTest, ttUtilsTest, chipsimTest];

testSuites.forEach((suite) => {
  suite.runSuite();
});
