import ttUtilsTest from "./ttUtils.test.js";
import testUtilsTest from "./testUtils.test.js";
import chipsimTest from "./chipsim.test.js";
import matchUtilsTest from "./matchUtils.test.js";

let testSuites = [testUtilsTest, ttUtilsTest, matchUtilsTest, chipsimTest];

testSuites.forEach((suite) => {
  suite.runSuite();
});
