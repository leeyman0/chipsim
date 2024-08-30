import ttUtilsTest from "./ttUtils.test.js";
import testUtilsTest from "./testUtils.test.js";
import chipsimTest from "./chipsim.test.js";
import chipUtilsTest from "./chipUtils.test.js";

let testSuites = [testUtilsTest, ttUtilsTest, chipUtilsTest, chipsimTest];

testSuites.forEach((suite) => {
  suite.runSuite();
});
