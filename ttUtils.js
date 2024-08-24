/** gets the dimensions of the truth table, by bits of input and and bits of output.
 * 
 * Truth tables must be canonical and well-formed, not sparse in the first row.
 * @param {Array} tt the Truth Table to analyze.
 * @returns {[number, number]} A tuple of the number of inputs and the number of outputs.
 */
function getDimensions(tt) {
  let ip = 0;
  let frame = tt;
  while (Array.isArray(frame[0])) {
    ++ip;
    frame = frame[0];
  }
  return [ip, frame.length];
}
/** sets the value of a truth table from a list of successive indexes and a value.
  * 
  * @param {Array} tt the truth table that gets set.
  * @param {Array} ip the indexes of the position that get set within the truth table.
  * @param {any} val the value that the position in the truth table gets set to.
  * @returns {void}
  */
function setTT(tt, ip, val) {
  let frame = tt;
  for (let m = 0; m < ip.length - 1; m++) {
    frame = frame[ip[m]];
  }
  frame[ip[ip.length - 1]] = val;
}
/** Gets the value at the position represented by ips.
 * 
 * @param {Array} tt the array that
 * @param {number[]} ip the indexes of each successive array. 
 * @returns {Array | any} the value in that space. 
 */
function getTT(tt, ip) {
  let frame = tt;
  for (let i = 0; i < ip.length; i++) {
    frame = frame[ip[i]];
  }
  return frame;
}

/** turns a number into its constituent bits.
 * 
 * @param {number} n the number to transform into bits.
 * @param {number} width the width to pad with zero
 * @returns {number[]} an array width-wide of either 0 or 1 that is the binary
 */
function toBits(n, width) {
  return  [...(n - 1).toString(2).padStart(width, "0")].map((b) => parseInt(b, 2));
}

export default Object.freeze({
    getDimensions,
    setTT,
    getTT,
    toBits,
});