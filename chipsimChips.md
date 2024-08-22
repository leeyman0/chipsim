# Implementing Chipsim Chips

Digital logic in this model is an acyclic digraph.
The nodes within the chips can have multiple inputs, and one output value.
The output value can go to any number of nodes that do not feed into the node that produces it.

A chip object has primitive component nodes inside of it,
that represent the basic boolean operations, **AND**, **OR**, and **NOT**.
**AND** and **OR** nodes take in 2 or more inputs, **NOT** can take in only 1.
All nodes produce only one output, fed into one wire.
Output wires can only accept one input.

The output gets from successive input chains until it reaches the start.
