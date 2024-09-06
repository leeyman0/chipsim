/** finds indexes of gates that match a pattern 
 * 
 * @param {object} chip the chip object to match upon
 * @param {Object} param1 options
 * @param {string} [param1.gate="*"] The gate to match. Can be "AND", "OR", "NOT", or "*" to match all gates. By default it matches all gates.
 * 
 * @returns {Array} The matches  
*/
function matchChip(chip, { gate = "*" }) {
  let matches = [];

  if (!chip || !Array.isArray(chip.gates)) { // All chips must have gates.
    console.error("matchChip called on a non-chip argument:", chip);
    return []; // No chip, no matches.
  }

  // This loop gathers all of the matches.
  chip.gates.forEach((current_gate, i) => {
    // gate star short circuits this conditional. Otherwise it matches the gate.
    if (gate === "*" || current_gate.gate === gate) {
      matches.push(i);
    }
  })

  return matches;
}
export default Object.freeze({ matchChip });