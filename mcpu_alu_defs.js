export const alu_a_op_mask  = 0x07
export const alu_neg_bit    = 0x08
export const alu_cin_bit    = 0x10
export const alu_b_op_mask  = 0x60
export const alu_b_op_shift = 5

export const alu_a_op_arith_name = {
	0: "ADD",
	1: "AND",
	2: "OR",
	3: "XOR",
	4: "A",
	5: "B",
	6: "X",
	7: "Y",
}

export const alu_a_op_arith_expr = {
	0: "A + B",
	1: "A & B",
	2: "A | B",
	3: "A ^ B",
	4: "A",
	5: "B",
	6: "X",
	7: "Y",
}

export const alu_a_op_test_name = {
	0: "A_EQ_Z",
	1: "B_EQ_Z",
	2: "A_GT_B",
	3: "A_EQ_B",
	4: "A_LT_B",
	5: "B_LO",
	6: "B_HI",
	7: "SENSE",
}

export const alu_a_op_test_expr = {
	0: "A == 0",
	1: "B == 0",
	2: "A > B",
	3: "A == B",
	4: "A < B",
	5: "B[0]",
	6: "B[MSB]",
	7: "sense",
}

export const alu_b_op_name = {
	0: "B",
	1: "IMM",
	2: "LSHIFT",
	3: "RSHIFT",
}

export const alu_b_op_expr = {
	0: "B",
	1: "ALU_IMM",
	2: "B << 1",
	3: "B >> 1",
}

export function decode_alu(alu_op) {
	const a_op_i = alu_op & alu_a_op_mask
	const neg    = !!(alu_op & alu_neg_bit)
	const cin    = !!(alu_op & alu_cin_bit)
	const b_op_i = (alu_op & alu_b_op_mask) >>> alu_b_op_shift

	const arith      = alu_a_op_arith_name[a_op_i]
	const arith_expr = alu_a_op_arith_expr[a_op_i]
	const test       = alu_a_op_test_name[a_op_i]
	const test_expr  = alu_a_op_test_expr[a_op_i]
	const b_op       = alu_b_op_name[b_op_i]

	const parts  = [arith]
	if (neg) parts.push("NEG")
	if (cin) parts.push("CIN")
	if (b_op_i !== 0) parts.push("B=" + b_op)

	return {
		alu_op:          alu_op,
		alu_op_hex:      "0x" + alu_op.toString(16).padStart(2, "0"),
		alu_op_bin:      "0b" + alu_op.toString(2).padStart(7, "0"),
		a_op_i:          a_op_i,
		a_op_arith:      arith,
		a_op_arith_expr: arith_expr,
		a_op_test:       test,
		a_op_test_expr:  test_expr,
		neg:             neg,
		cin:             cin,
		b_op_i:          b_op_i,
		b_op:            b_op,
		b_op_expr:       alu_b_op_expr[b_op_i],
		mnemonic:        parts.join(" "),
	}
}
