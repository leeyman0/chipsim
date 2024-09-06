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

/** Removes all instances of double not from a chip.
 *
 * @param {*} chip the chip object to remove double not from.
 */
function removeDoubleNot(chip) {
  // mapping dependencies.
  // the gate index to the gate indices that rely on it
  let indexMap = new Map();
  chip.gates.forEach((gate, i) => {
    for (const j in gate.input) {
      const deps = indexMap.get(j);
      if (deps) {
        deps.push(i);
      } else {
        indexMap.set([i]);
      }
    }
  });

  // Getting chains of NOT gates, that only are chains.
  let nots = new Map();
  chip.gates.forEach((gate, i) => {
    // What we're _actually_ looking for is singleton not with not on the end
    if (gate.gate === "NOT") {
      const successors = indexMap.get(i);
      const hasOneSuccessor = successors && successors.length === 1;
      if (hasOneSuccessor && chip.gates[successors[0]].gate === "NOT") {
        nots.set(i, successors[0]);
      }
    }
  });

  // Transforming things into a usable state
  let trains = new Map();
  // All of the cars in the train
  let covered = new Set();
  nots.forEach((value, key) => {
    const keyHasBeenCovered = covered.has(key);
    const valueHasBeenCovered = covered.has(value);
    if (!keyHasBeenCovered) {
      // We are NOT covered, this path has not been traversed.
      if (!valueHasBeenCovered) {
        // We've found a train
      } else {
        // We have found a missing head
        let train = trains.get(value); // get the train from the value that HAS been traversed
        // Check to see if the head is the value.
        if (train[0] === value)
          train.unshift(key); // place the missing head at the neck of the train
          // Then we are going to form a coalescing tree.
        else;
      }
    } // Otherwise we do nothing
  });
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
  removeDoubleNot,
});
