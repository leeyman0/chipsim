/** These are utilities for working within chips.
 *
 * These can clone and optimize layouts of the gates within the chips.
 */

/** returns a chip object with no reference to the original.
 * The new chip can be modified with no modification to the original.
 *
 * @param {object} param0 the chip to clone
 * @param {number} param0.inputs The number of inputs that need to be supplied to the chip each time it gets run.
 * @param {object[]} param0.gates The gates that are contained within the chip.
 * @param {number[]} param0.output the indexes of the output gates.
 */
function cloneChip({ inputs, gates, output }) {
  return {
    inputs,
    output: [...output],
    gates: gates.map((o) => {
      return { ...o };
    }),
  };
}

/** eliminates unreachable gates from the output.
 * @param {object} chip the chip to remove unused gates from. It gets modified.
 */
function removeUnusedGates(chip) {
  const traversalMemo = new Array(chip.gates.length).fill(false);
  // first, eliminate gates that aren't traversed from output.
  for (const out of chip.output) {
    let stack = [out];
    while (stack.length > 0) {
      let cIndex = stack.pop();
      // console.log("traversing", cIndex);
      traversalMemo[cIndex] = true;
      // This line is a work of art. It loads onto the stack all untraveled proper indices.
      stack.push(...chip.gates[cIndex].input.filter((i) => i >= 0 && !traversalMemo[i]));
    }
  }

  // get the indices to eliminate
  let eliminate = traversalMemo.flatMap((p, i) => (p ? [] : [i]));
  // console.log("eliminating", eliminate);
  // make a translation table from the indices to eliminate
  // to translate old indices to new ones.
  let translationTable = new Map();

  let downset = 0;
  for (let i = 0; i < chip.gates.length; i++) {
    if (i === eliminate[0]) {
      ++downset;
      eliminate.shift();
    } else {
      translationTable.set(i, i - downset);
    }
  }

  // change every single reference
  chip.gates = chip.gates.flatMap((g, i) => {
    if (translationTable.get(i) === undefined) return [];
    else
      return [
        {
          gate: g.gate,
          input: g.input.map((ip) => (ip < 0 ? ip : translationTable.get(ip))),
        },
      ];
  });

  // change all the references in the output too.
  chip.output = chip.output.map((ip) => (ip < 0 ? ip : translationTable.get(ip)));
  // Find tautologous gates
  return chip;
}

/** eliminates unnecessary gates inside the chip, eliminates tautologous and contradictory logic.
 *
 * @param {object} chip The chip that gets cut into
 */
function optimizeLayout(chip) {
  return chip;
}

export default Object.freeze({
  cloneChip,
  optimizeLayout,
  removeUnusedGates,
});
