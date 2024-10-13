/** makes the function that produces an output for each match
 *
 * @param {object} chip The chip to match upon.
 *
 * @returns {(object, number) => object[]}
 */
function buildCaptureFunction(chip, [followedBySpecified, followedByIndices], options, flags, captures) {
  let { gate = "*", precededBy = "*", precededByN = "*", followedBy = "*", followedByN = "*" } = options;
  let { rootIndex = true, precedingIndex = false, followingIndex = false, beforePrecedingIndex = false, afterFollowingIndex = false } = captures;
  let { exclusive = false } = flags;

  const defaultCaptureOptions = rootIndex && !(precedingIndex || followingIndex || beforePrecedingIndex || afterFollowingIndex);

  if (defaultCaptureOptions) {
    return (current_gate, i) => {
      // We are chaining all the things together.
      // gate star short circuits this conditional. Otherwise it matches the gate.
      const gateMatches = gate === "*" || current_gate.gate === gate;
      // We shouldn't even calculate if gateMatches is true because precededBy will not match.
      // If gateMatches and precededBy is specified to be a particular gate, we search for any gates that precede it.
      const precededByMatches = gateMatches && (precededBy === "*" || current_gate.input.some((gi) => (gi >= 0 ? chip.gates[gi].gate === precededBy : false)));
      // precededByN only matches if the rest match and the number of gates of input match.
      const precededByNMatches = precededByMatches && (precededByN === "*" || precededByN === current_gate.input.length);
      // Just the same as the others, except it checks to see if followedBy is specified.
      const followedByOk =
        precededByNMatches &&
        (!followedBySpecified || // Don't do followedBy checks if it's not specifed. Automatically succeeds if true.
          ((followedBy === "*" || followedByIndices[i].some((gi) => chip.gates[gi].gate === followedBy)) && // Check to see if it is followed by a specific gate
            (followedByN === "*" || followedByIndices[i].length === followedByN))); // Check to see if it is followed by the correct number of gates.

      return followedByOk ? [i] : [];
    };
  } else {
    // Start making the callback.
    // We check the bounds of functions to make sure that they don't get matched again
    // false means that it isn't available anymore. true means that it still is.
    let exclusivityArray = new Array(chip.gates.length);
    if (exclusive) {
      // If there isn't any exclusivity, it doesn't need to be initialized.
      for (let i = 0; i < exclusivityArray.length; i++) {
        exclusivityArray[i] = true;
      }
    }
  }
}
/** finds indexes of gates that match a pattern
 *
 * @param {object} chip the chip object to match upon
 * @param {object} options pattern options. we specify which arguments match
 * @param {string} [options.gate="*"] The gate to match. Can be "AND", "OR", "NOT", or "*" to match all gates. By default it matches all gates.
 * @param {string} [options.precededBy="*"] Checks to see the gate of what the current gate is preceded by. By default it doesn't check for anything.
 * @param {string | number} [options.precededByN="*"] Checks to see how many gates precede the current one. By default it accepts all numbers of gates.
 * @param {string} [options.followedBy="*"] Checks to see the gate of what the current gate is followed by. By default it doesn't check for anything.
 * @param {string | number} [options.followedByN="*"] Checks to see how many gates follow the current one. By default it accepts all numbers of gates.
 * @param {object} [options.capture] Specifies a format to put matches into. If this is left blank then this function will return the indexes of
 * the root.
 * @param {boolean} [options.capture.rootIndex=true] Captures the root index, the one specified by the pattern gate option. If all of the other options are
 * not defined
 * @param {boolean} [options.capture.precedingIndex=false] Captures the preceding indices if the `preceded%` options aren't defined. If some are defined,
 * it captures the matching index or indices.
 * @param {boolean} [options.capture.followingIndex=false] Captures the following indices if the `followed%` options aren't defined. If some are define
 * @param {boolean} [options.capture.afterFollowingIndex=false] Captures the indices following the following indices, but only if some
 * @param {boolean} [options.capture.beforePrecedingIndex=false]
 * @param {object} [options.flags] Extra options that modify the rules that the patterns follow
 * @param {boolean} [options.flags.exclusive=false] If this is true and a pattern
 *
 * @returns {Array} The matches. They can be either
 */
function matchChip(
  chip,
  options = {
    gate: "*",
    precededBy: "*",
    precededByN: "*",
    followedBy: "*",
    followedByN: "*",
    capture: {
      rootIndex: true,
      precedingIndex: false,
      followingIndex: false,
      beforePrecedingIndex: false,
      afterFollowingIndex: false,
    },
    flags: {
      exclusive: false,
    },
  },
) {
  // Useful for doing verification
  let { gate = "*", precededBy = "*", precededByN = "*", followedBy = "*", followedByN = "*", flags = {}, capture = {} } = options;

  let matches = [];

  // Checking if the chip is a valid argument
  if (!chip || !Array.isArray(chip.gates)) {
    // All chips must have gates.
    console.error("matchChip called on a non-chip argument:", chip);
    return []; // No chip, no matches.
  }

  // Checking if we have received a correct precededByN argument
  if ((precededByN !== "*" && !Number.isInteger(precededByN)) || precededByN < 0) {
    console.error('matchChip called with bad precededByN argument. Expecting a whole positive number or "*", but received:', precededByN);
    return [];
  }

  // Checking if we have received a correct followedByN argument
  if ((followedByN !== "*" && !Number.isInteger(followedByN)) || followedByN < 0) {
    console.error('matchChip called with bad followedByN argument. Expecting a whole positive number or "*", but received:', followedByN);
    return [];
  }

  // If followedBy options are not specified, then we can skip part of the preparation process.
  const followedBySpecified = followedBy !== "*" || followedByN !== "*";
  // Initialize followedBy information
  let followedByIndices = new Array(chip.gates.length);
  if (followedBySpecified) {
    // Initialize followedBy information
    for (let i = 0; i < followedByIndices.length; i++) {
      followedByIndices[i] = [];
    }
    // Gather followedBy information.
    chip.gates.forEach((current_gate, i) => {
      current_gate.input.forEach((precedingIndex) => {
        // console.log("precedingIndex:", precedingIndex);
        if (precedingIndex >= 0) followedByIndices[precedingIndex].push(i);
      });
    });
  }

  // This loop gathers all of the matches.
  return chip.gates.flatMap(buildCaptureFunction(chip, [followedBySpecified, followedByIndices], options, flags, capture));
}

export default Object.freeze({ matchChip });
