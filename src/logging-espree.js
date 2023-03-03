import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

export async function transpile(inputFile, outputFile) {
  // Fill in the code here
}


/**
 * @description Adds logging statements at the beginning of any function.
 *
 * @param {string} code The code to process.
 * @returns {string} The JavaScript code with logging statements added
 */
export function addLogging(code) {
  const ast = espree.parse(code, { ecmaVersion: 2020, loc: true });
  estraverse.traverse(ast, {
    enter: function(node, _) {
      if (/\w*Function\w*/.test(node.type)) addBeforeCode(node);
    }
  });
  return escodegen.generate(ast);
}

function addBeforeCode(node) {
 // Fill in the code here
}
