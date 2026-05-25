// MCPU architecture definitions: constants and decode functions

export const op_imm_mask     = 0x7f
export const op_imm_bit      = 0x80
export const op_cond_bit     = 0x40
export const op_source_mask  = 0x07
export const op_target_mask  = 0x38
export const op_target_shift = 3

export const source_id_to_name = {
	0: "PC",
	1: "ADDR",
	2: "RAM",
	3: "IMM",
	4: "ALU",
	5: "I",
	6: "J",
	7: "K",
}

export const source_id_to_long_name = {
	0: "CNT_PC",
	1: "REG_ADDR",
	2: "READ_RAM",
	3: "SRG_IMM",
	4: "ALU_RES",
	5: "REG_I",
	6: "REG_J",
	7: "REG_K",
}

export const target_id_to_name = {
	0: "PC",
	1: "ADDR",
	2: "RAM",
	3: "A",
	4: "B",
	5: "I",
	6: "J",
	7: "K",
}

export const target_id_to_long_name = {
	0: "CNT_PC",
	1: "REG_ADDR",
	2: "WRITE_RAM",
	3: "ALU_A",
	4: "ALU_B",
	5: "REG_I",
	6: "REG_J",
	7: "REG_K",
}

export function decode_instruction(op) {
	const is_imm  = !!(op & op_imm_bit)
	const is_cond = !!(op & op_cond_bit)

	if (is_imm) {
		const imm = op & op_imm_mask
		return {
			opcode:     op,
			opcode_hex: "0x" + op.toString(16).padStart(2, "0"),
			opcode_bin: "0b" + op.toString(2).padStart(8, "0"),
			type:       "IMM",
			imm:        imm,
			imm_hex:    "0x" + imm.toString(16).padStart(2, "0"),
			mnemonic:   "IMM 0x" + imm.toString(16).padStart(2, "0"),
		}
	}

	const source_i = op & op_source_mask
	const target_i = (op & op_target_mask) >>> op_target_shift
	const type     = is_cond ? "CMOV" : "MOV"
	const src      = source_id_to_name[source_i]
	const tgt      = target_id_to_name[target_i]

	return {
		opcode:      op,
		opcode_hex:  "0x" + op.toString(16).padStart(2, "0"),
		opcode_bin:  "0b" + op.toString(2).padStart(8, "0"),
		type:        type,
		is_cond:     is_cond,
		source_i:    source_i,
		source:      src,
		source_long: source_id_to_long_name[source_i],
		target_i:    target_i,
		target:      tgt,
		target_long: target_id_to_long_name[target_i],
		mnemonic:    type + " " + src + " " + tgt,
	}
}
