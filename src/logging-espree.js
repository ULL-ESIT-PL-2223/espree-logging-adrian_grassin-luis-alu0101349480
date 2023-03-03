import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8'); // Usamos el formato utf-8 para que no nos de problemas con los caracteres especiales
  let output = addLogging(input); 
  if (outputFile === undefined) {
    console.log(output);
    return;
  }
  await fs.writeFile(outputFile, output);
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


/**
 * @desc Recibe un nodo y le añade un console.log antes de la función, incluyendo el numero de linea y
 * 
 * @param {*} node 
 */
function addBeforeCode(node, lines) {
  const name = node.id ? node.id.name : '<anonymous function>';
  const parameters = node.params.map(param => `\$\{${param.name}\}`);
  const beforeCode = "console.log(`Entering " + name + "(" + parameters + ") at line " + lines + "`);";
  const beforeNodes = espree.parse(beforeCode, {ecmaVersion:6}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}


