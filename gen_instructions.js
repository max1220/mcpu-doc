#!/usr/bin/env node
// Decodes every possible 8-bit MCPU opcode and prints the JSON array to stdout.
import * as mcpu_defs from "./mcpu_defs.js";

function annotate(instr) {
	if (instr.type === "IMM") return instr
	const { source, target, is_cond } = instr
	instr.is_nop = (source === target) && ["ADDR", "RAM", "I", "J", "K"].includes(source)
	if (!is_cond && source === "PC" && target === "PC") {
		instr.alt_mnemonic = "HALT"
		instr.halt = true
	} else if (is_cond && target === "PC") {
		instr.alt_mnemonic = "BRANCH " + source
	} else if (!is_cond && target === "PC") {
		instr.alt_mnemonic = "JUMP " + source
	} else if (source === "RAM") {
		instr.alt_mnemonic = "LOAD " + target
	} else if (target === "RAM") {
		instr.alt_mnemonic = "STORE " + source
	}
	return instr
}

const instructions = []
for (let op = 0; op <= 0xff; op++) {
	instructions.push(annotate(mcpu_defs.decode_instruction(op)))
}
process.stdout.write(JSON.stringify(instructions, null, "\t") + "\n")
