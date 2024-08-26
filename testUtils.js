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

export default Object.freeze({
  deepArrEq,
});
