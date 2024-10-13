/** This is a utility function that doesn't come with javascript. Be careful with it,
 * as it doesn't come with the ability to handle circular references. The handling of
 * circular references is left as an exercise to the reader, as it is not needed for our usage.
 *
 * @param {Array} a1 the first array to compare
 * @param {Array} a2 the second array to compare
 * @returns {boolean} the result of the comparison. `true` if a1 and a2 are similar, `false` otherwise.
 * @example <caption>1. A true comparison.</caption>
 * const a = [1, 2, [3, 4, 5]];
 * const b = [...a];
 *
 * console.log(a === b); // > false
 * console.log(deepArrEq(a, b)); // > true
 *
 * @example <caption>2. false comparisons.</caption>
 * const a = [1, 2, 3];
 * const b = [1, 2, 4];
 *
 * console.log(deepArrEq(a, b)); // > false
 *
 * const c = [1, 2];
 * console.log(deepArrEq(a, c)); // > false
 * console.log(deepArrEq(c, a)); // > false
 *
 * @example <caption>3. thread hangs on circular references</caption>
 * let a = [3, 2, 1];
 * a.push(a);
 *
 * console.log(deepArrEq(a, [...a])); // Nothing will get executed past
 * // that point and a stack overflow will result.
 */
function deepArrEq(a1, a2) {
  const arrp1 = Array.isArray(a1),
    arrp2 = Array.isArray(a2);
  if (arrp1 && arrp2) {
    // both are arrays
    if (a1.length === a2.length) {
      return a1.every((e, i) => deepArrEq(e, a2[i]));
    } else return false; // a1 and a2 must be equal in size
  } else if (arrp1 || arrp2)
    return false; // mismatch in dimensionality
  else return a1 === a2; // They are both elements and should be compared as elements
}

/** This is utility function to compare objects and arrays recursively, so that arrays and objects can be handled inside of each other.
 * Be careful, it doesn't have the ability to handle circular references.
 *
 * To check whether the organizations match, it will go through these steps:
 * 1. Check to see whether o1 and o2 are both arrays.
 *   - If o1 or o2 but not both are arrays, return false.
 *   - If they are both arrays, check to see if they are the same length.
 *     * If they are both arrays of the same length, then use deepArrObjEq to check that every element in o1 matches the corresponding
 * element in o2.
 * 2. If they are not arrays, then o1 and o2 are objects or primitives. Check to see whether o1 and o2 are both objects.
 *   - If o1 or o2 is an object but not both, return false.
 *   - If they are both objects, then check to see if they have the same keys.
 *     * If they both have the same keys, then use deepArrObjEq to check that every one of the corresponding values in o1 match o2.
 * 3. If they are not arrays or objects, use strict equality (`===`) to compare the primitive values.
 *
 * @param {*} o1 the first object to compare
 * @param {*} o2 the second object to compare
 * @returns {boolean} the result, whether these are practically the same.
 */
function deepArrObjEq(o1, o2) {
  const o1ArrP = Array.isArray(o1);
  const o2ArrP = Array.isArray(o2);
  if (o1ArrP !== o2ArrP)
    return false; // The types don't match
  else if (o1ArrP && o2ArrP) {
    if (o1.length !== o2.length) return false;
    else return o1.every((e, i) => deepArrObjEq(e, o2[i]));
  } else {
    // Check to see if they are both objects
    const o1ObjP = o1.constructor === Object;
    const o2ObjP = o1.constructor === Object;
    if (o1ObjP !== o2ObjP) return false;
    else if (o1ObjP && o2ObjP) {
      // Check to see if the keys are the same
      let o1Keys = Object.keys(o1).sort();
      let o2Keys = Object.keys(o2).sort();
      if (!deepArrEq(o1Keys, o2Keys)) return false;
      else return o1Keys.every((k) => deepArrObjEq(o1[k], o2[k]));
    } else {
      // They should be compared using strict equality
      return o1 === o2;
    }
  }
}

export default Object.freeze({
  deepArrEq,
  deepArrObjEq,
});
