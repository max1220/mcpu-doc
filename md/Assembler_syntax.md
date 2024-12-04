# Assembler syntax

The example assemblers implemented in mcpu-web and the Lua implementations
share a common syntax used by their assemblers, which made them easy to implement.

Each token is separated using any space character. Tokens are not case-sensitive.

The value that is modified in an operation is at the end of an instruction.


## Comments

Line-based comments using `#` are supported, which are removed in a pre-processing step.



## Strings

String literals(values inside double-quotes `"`) are replaced by sequences of
`BYTE` pseudo-instructions in a pre-processing step.



## Labels

Labels are defined by the `:` or `LABEL` token, followed by a label name(case-insensitive)



# TODO

TODO