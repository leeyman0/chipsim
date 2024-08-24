import ttUtils from './ttUtils.js';

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
          return a * b;
        }
        function or(a, b) {
          return (a + b) % 2;
        }
        function not(a) {
          return a === 0 ? 1 : 0;
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
function connectChips(c1, c2, oi) {

}

/** builds a demultiplexer chip from a number of bits.
 * 
 * @param {number} bits 
 * @returns {object} a chip object containing the demultiplexer
 */
function buildDemultiplexer(bits) {
  // Ohh, so _that's_ why it takes so long!
  // will store the gates and outputs.
  let gates = [{
    gate: 'NOT',
    input: [-1],
  }];
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
      let n = gates.length;
      gates.push({
        gate: "AND",
        input: [gi,  n - 1]         
      });
      // "This gate is the next output", the one at index m. It happens when the current bit is 1
      let m = gates.length;
      gates.push({
        gate: "AND",
        input: [gi, current_bit]
      })
      return [n, m];
    })
  }

  return {
    inputs: bits,
    gates,
    output    
  };
}

/** creates a chip model from a truth table.
 * @param {Array} tt
 * @return {Object} a chip model.
 */
function fromTruthTable(tt) {
  // inputs is the number of inputs, outputs is the number of outputs.
  let [inputs, outputs] = ttUtils.getDimensions(tt);

  let gate = [];
  let output = new Array(outputs);

  let chip = {
    inputs,
    output,
    gate,
  }
  return chip;
}

/** optimizes gate layout of a chip, by eliminating duplicates and equivalent structures.
 * 
 * @param {object} chip the chip that gets optimized. It will be modified.
 * @returns {object} the optimized chip. Will be the same thing as the parameter.
 */
function bake(chip) {


  return chip;
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
});
