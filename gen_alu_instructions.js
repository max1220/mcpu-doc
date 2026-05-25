#!/usr/bin/env node
// Decodes every possible 7-bit MCPU ALU operation byte and prints the JSON array to stdout.
import * as mcpu_alu_defs from "./mcpu_alu_defs.js";

const alu_instructions = []
for (let op = 0; op <= 0x7f; op++) {
	alu_instructions.push(mcpu_alu_defs.decode_alu(op))
}

process.stdout.write(JSON.stringify(alu_instructions, null, "\t") + "\n")
