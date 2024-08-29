import ttUtils from "./ttUtils.js";

/** runs a chip on inputs to produce outputs.
 * @param {Object} c the chip object
 * @param {number[]} inputs an array of 0 or 1
 * @returns {number[]} the outputs of running it, represented as an array of 0 or 1
 */
function run(c, inputs) {
  if (inputs.length !== c.inputs) {
    console.error(`The chip must receive the exact number of inputs. Received ${inputs}`);
    return new Array(c.output.length).fill(0); // This is a dummy output
  }

  // -1 means not calculated yet. It's indexed by the length
  let memo = Array(c.gates.length).fill(-1);
  /** a function that calculates a value for i */
  return c.output.map(function access(i) {
    if (i < 0)
      return inputs[~i]; // Since an integer can be positive or negative, i am using
    // the negative integers to index input
    else {
      let cv = memo[i];
      if (cv >= 0)
        return cv; // memo[i] has been calculated
      else {
        // memo[i] is not calculated, so calculate it by looking up the position in the
        // array of gates.
        let { gate, input } = c.gates[i];

        // Where each of the functions happen
        function and(a, b) {
          return a & b;
        }
        function or(a, b) {
          return a | b;
        }
        function not(a) {
          return ~a & 1; // We are working with only one bit, but bitwise not works on the others.
        }
        if (gate === "AND") {
          memo[i] = and(access(input[0]), access(input[1]));
          // console.log(`${gate}\t${input} = ${memo[i]}`);
          return memo[i];
        } else if (gate === "OR") {
          memo[i] = or(access(input[0]), access(input[1]));
          // console.log(`${gate}\t${input} = ${memo[i]}`);
          return memo[i];
        } else if (gate === "NOT") {
          memo[i] = not(access(input[0]));
          // console.log(`${gate}\t${input} = ${memo[i]}`);
          return memo[i];
        }
        return memo[i];
      }
    }
    return 0;
  });
}

/** connects two chips.
 *
 * @param {object} c1 the first chip
 * @param {object} c2 the second chip
 * @param {Map<number, number>} oi the way to connect both chips.
 * @returns {object} the resultant chip.
 */
function connectChips(c1, c2, oi) {}

/** builds a demultiplexer chip from a number of bits.
 *
 * @param {number} bits
 * @returns {object} a chip object containing the demultiplexer
 */
function buildDemultiplexer(bits) {
  // Ohh, so _that's_ why it takes so long!
  // will store the gates and outputs.
  let gates = [
    {
      gate: "NOT",
      input: [-1],
    },
  ];
  let output = [0, -1];

  // Using the iterative approach, generating the demux to the number of bits that we need.
  for (let i = 1; i < bits; i++) {
    const current_bit = ~i;
    output = output.flatMap((gi) => {
      gates.push({
        gate: "NOT",
        input: [current_bit],
      });
      // "This gate is the first output", the one at index n. It happens when the current bit is 0
      const n = gates.length;
      gates.push({
        gate: "AND",
        input: [gi, n - 1],
      });
      // "This gate is the next output", the one at index m. It happens when the current bit is 1
      const m = gates.length;
      gates.push({
        gate: "AND",
        input: [gi, current_bit],
      });
      return [n, m];
    });
  }

  return {
    inputs: bits,
    gates,
    output,
  };
}

/** creates a chip model from a truth table.
 * @param {Array} tt
 * @return {Object} a chip model.
 */
function fromTruthTable(tt) {
  // inputs is the number of inputs, outputs is the number of outputs.
  let [inputs, outputs] = ttUtils.getDimensions(tt);

  // The output array gets initialized within the demux.outputs loop.
  let output = new Array(outputs);

  // getting access to each of the inputs via a demultiplexer
  let demux = buildDemultiplexer(inputs);

  // use the gates over from demuxer, so that we have the base logic and don't have to copy anything.
  let gates = demux.gates;

  // This is the straightforward way. Build a demultiplexer, then take each of the inputs and
  // translate them into the expectedOutput.
  demux.output.forEach((gate_index, input_index) => {
    const current_case = ttUtils.toBits(input_index, inputs);
    // console.log(current_case);
    const expectedOutput = ttUtils.getTT(tt, current_case);

    if (input_index > 0) {
      // Push or gates to get the output working, and update the outputs.
      expectedOutput.forEach((g, i) => {
        if (g !== 0) {
          // If the expected output is false, it doesn't get updated at all.
          let og = gates.length;
          gates.push({
            gate: "OR",
            input: [output[i], gate_index],
          });
          // The output is updated to reflect the current input.
          output[i] = og;
        }
      });
    } else {
      // Initalize the array of output indexes.
      expectedOutput.forEach((g, i) => {
        if (g === 0) {
          // Create a NOT gate,
          let ng = gates.length;
          gates.push({
            gate: "NOT",
            input: [gate_index],
          });
          // create an AND gate,
          let ag = gates.length;
          gates.push({
            gate: "AND",
            input: [gate_index, ng],
          });
          // to make sure false is provided to output.
          output[i] = ag;
        } else {
          // We don't have to change anything.
          output[i] = gate_index;
        }
      });
    }
  });

  return {
    inputs,
    output,
    gates,
  };
}

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

/** optimizes gate layout of a chip, by eliminating duplicates and equivalent structures.
 *
 * @param {object} chip the chip that gets optimized. It will not be modified.
 * @returns {object} the optimized chip. Will be the same thing as the parameter.
 */
function bake(chip) {
  const newChip = cloneChip(chip);

  const traversalMemo = new Array(chip.gates.length).fill(false);
  // first, eliminate gates that aren't traversed from output.
  for (const out of newChip.output) {
    let stack = [out];
    while (stack.length > 0) {
      let cIndex = stack.pop();
      console.log("traversing", cIndex);
      traversalMemo[cIndex] = true;
      // This line is a work of art. It loads onto the stack all untraveled proper indices.
      stack.push(...newChip.gates[cIndex].input.filter((i) => i >= 0 && !traversalMemo[i]));
    }
  }

  // get the indices to eliminate
  let eliminate = traversalMemo.flatMap((p, i) => (p ? [] : [i]));
  console.log("eliminating", eliminate);
  // make a translation table from the indices to eliminate
  // to translate old indices to new ones.
  let translationTable = new Map();

  let downset = 0;
  for (let i = 0; i < newChip.gates.length; i++) {
    if (i === eliminate[0]) {
      ++downset;
      eliminate.shift();
    } else {
      translationTable.set(i, i - downset);
    }
  }

  // change every single reference
  newChip.gates = newChip.gates.flatMap((g, i) => {
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
  newChip.output = newChip.output.map((ip) => (ip < 0 ? ip : translationTable.get(ip)));
  // Find tautologous gates
  return newChip;
}

/** creates a truth table from a chip model. It does this by running the chip through all the
 * possible inputs.
 * @param {Object} c The chip model to run.
 * @returns {Array} The truth table.
 */
function toTruthTable(c) {
  // Generating all inputs
  let allInputs = [];
  for (let i = 0; i < 2 ** c.inputs; i++) {
    allInputs.push([...i.toString(2).padStart(c.inputs, "0")].map((b) => parseInt(b)));
  }
  // Initializing the table
  let output = [];
  let stack = [[output, 0]];
  while (stack.length > 0) {
    // Array initialization is dumb but I can do it.
    let [frame, depth] = stack.pop();
    if (depth < c.inputs) {
      frame.push([], []);
      stack.push([frame[0], depth + 1], [frame[1], depth + 1]);
    }
  }
  // console.log(output);

  // Run the chip for each input
  allInputs.forEach((v) => {
    ttUtils.setTT(output, v, run(c, v));
  });
  // console.log(output);
  return output;
}

export default Object.freeze({
  run,
  bake,
  buildDemultiplexer,
  fromTruthTable,
  toTruthTable,
  cloneChip,
});
