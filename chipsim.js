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

/** creates a chip model from a truth table.
 * @param {Array} tt
 * @return {Object} a chip model.
 */
function fromTruthTable(tt) {
  function getDimensions(tt) {
    let ip = 0;
    let frame = tt;
    while (Array.isArray(frame[0])) {
      ++ip;
      frame = frame[0];
    }
    return [ip, frame.length];
  }

  // TODO: Implement
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
  // Takes care of setting the value from a list of successive indexes.
  function recSet(input, s) {
    let frame = output;
    for (let m = 0; m < input.length - 1; m++) {
      frame = frame[input[m]];
    }
    frame[input[input.length - 1]] = s;
  }

  // Run the chip for each input
  allInputs.forEach((v) => {
    recSet(v, run(c, v));
  });
  // console.log(output);
  return output;
}

export default Object.freeze({
  run,
  fromTruthTable,
  toTruthTable,
});
