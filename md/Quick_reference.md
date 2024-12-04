# MCPU quick reference

MCPU is probably best described as a TTA-like uRISC CPU architecture



## Specifications

 * Registers
   - `CNT_PC`: Program counter
   - `REG_ADDR`: Address used for reading/writing RAM
   - `SRG_IMM`: Last decoded immediate value
   - `REG_ALU_A`, `REG_ALU_B`: Values used in ALU operations
   - `REG_I`, `REG_J`, `REG_K`: General-purpose registers
     * optional, might be used for other purposes depending on implementation
 * Memory
   - Flat address space same size as word size
     * Implementations could use General-purpose registers for address extension for small word-sized(e.g. 8-bit)
   - Instruction memory(`IROM`) only addressed by `CNT_PC`, read only on instruction fetch
   - Data memory(`DRAM`) only addressed by `REG_ADDR`, and read/written to using the bus(RAM source/target).
 * Fixed 8-bit instruction set
   - works with any word-size by adding/removing stages for the immediate value shift register
 * Only moves data on a single bus shared between functions/registers(TTA-like)
   - "MOV-only instruction set"



## Instruction set

The MCPU instruction set is a fixed 8-bit instruction set.
It can be thought of as only having three instructions:

 * `MOV <src> <dst>`
   - Move value from source to target
 * `CMOV <src> <dst>`
   - Conditional move value from source to target(executes only if ALU test output is true)
 * `IMM <7 bit immediate>`
   - Load or shift in immediate value(first `IMM` instruction loads a new value, successive `IMM` instructions shift in more bits)



## Instruction Encoding

|       7 |       6 |      5 |      4 |      3 |      2 |      1 |      0 |
| ------- | ------- | ------ | ------ | ------ | ------ | ------ | ------ |
|  IS_IMM | IS_COND | TARGET | TARGET | TARGET | SOURCE | SOURCE | SOURCE |

 * Bits 0-2 encode the operation source register/function
 * Bits 3-5 encode the operation target register/function
 * Bit 6, if set, makes the operation conditional(only executes instruction if ALU test result is true)
 * Bit 7, if set, makes the operation an `IMM` instruction, and the lower 7 bits are instead used as the immediate value,
   which is loaded or shifted into the immediate value, depending on if the last instruction was also an `IMM` instruction.



## Sources

Sources are functions/registers that can be read on the bus.

 * Program counter (0)
 * Address register (1)
 * RAM at address register (2)
 * Last encoded immediate value (3)
 * ALU result (4)
 * Registers I, J, K (5, 6, 7)



## Targets

Targets are functions/registers that can be written to from the bus.

 * Program counter (0)
 * Address register (1)
 * Write to RAM at address register (2)
 * ALU registers A and B (3, 4)
 * Registers I, J, K (5, 6, 7)



## ALU

The ALU performs operations on the values in the ALU registers `A` and `B` with the
current ALU instruction in the IMM register to produce a result.
The upper bits of the IMM register can still be used as an immediate value, see B pre-operation.

|       6 |      5 |      4 |      3 |      2 |      1 |      0 |
| ------- | ------ | ------ | ------ | ------ | ------ | ------ |
|   B_PRE |  B_PRE |    CIN |    INV |     OP |     OP |     OP |

 * Data operation(Bits 0-2)
   - `ADD`(0), `AND`(1), `OR`(2), `XOR`(3), `A`(4), `B`(5), `X`(6), `Y`(7)
 * Test operation(Bits 0-2)
   - `A==0`(0), `B==0`(1), `A>B`(2), `A==B`(3), `A<B`(4), `low bit B`(5), `high bit B`(6), `SENSE`(7)
 * Bit 3 inverts the B operation *after* the B pre-operation, but *before* the data/test operation
 * Bit 4 is the carry-in bit for addition(if set, result of add operation is A+B+1)
 * B pre-operation(Bits 5,6)
   - alter the value in the B register before it is used in the data/test operation
   - B unmodified(0), replace by ALU immediate(1), B right/left shifted by 1 (2, 3)



## Macro-instructions

Some common assembler idioms can be easily implemented using multiple instructions.

 * `IMM <large immediate>` -> `IMM <7-bit part>` ; `IMM <7-bit part>` ; (...)
 * `IMOV <i_val> <dst>` -> `IMM <i_val>` ; `MOV IMM <dst>`
 * `JUMP <i_addr>` -> `IMOV <i_addr> PC`
 * `ADDR <i_addr>` -> `IMOV <i_addr> ADDR`
 * `LOAD <i_addr> <dst>` -> `ADDR <i_addr>` ; `MOV RAM <dst>`
 * `STORE <i_addr> <src>` -> `ADDR <i_addr>` ; `MOV <src> RAM`
 * `ALU <alu_op>` -> `IMM <encoded ALU operation>`
 * `BRANCH <i_addr> <alu_op>` -> `ADDR <i_addr>` ; `ALU <alu_op>` ; `CMOV ADDR PC`
