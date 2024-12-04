# Macro instructions

Some common assembler idioms can be easily implemented using multiple instructions.

 * `IMM <large immediate>`
   - `IMM <7-bit part>`
   - `IMM <7-bit part>`
   - (...)
 * `IMOV <i_val> <dst>`
   - `IMM <i_val>`
   - `MOV IMM <dst>`
 * `JUMP <i_addr>`
   - `IMOV <i_addr> PC`
 * `ADDR <i_addr>`
   - `IMOV <i_addr> ADDR`
 * `LOAD <i_addr> <dst>`
   - `ADDR <i_addr>`
   - `MOV RAM <dst>`
 * `STORE <i_addr> <src>`
   - `ADDR <i_addr>`
   - `MOV <src> RAM`
 * `ALU <alu_op>`
   - `IMM <encoded ALU operation>`
 * `BRANCH <i_addr> <alu_op>`
   - `ADDR <i_addr>`
   - `ALU <alu_op>`
   - `CMOV ADDR PC`

Other common operations:

Perform ALU operation on 2 values stored in RAM, store result in RAM:
```
LOAD <i_addr_a> A
LOAD <i_addr_b> B
ADDR <i_addr_res>
ALU <alu_op>
MOV ALU RAM
```


Increment value:
```
MOV <src> A
ALU ADD IMM C 0 # add a+IMM with carry in
MOV ALU <dst>
```


Add to value:
```
MOV <src> A
ALU ADD IMM _ <add> # add a+IMM
MOV ALU <dst>
```
