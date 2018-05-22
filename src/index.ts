#!/usr/bin/env node

import './aliases';

const main = (args: string[]) => {
    // 0.a parse command line options
    // 0.b parse ? configuration file ?

    // 1.a each file goes into the preprocessor => 1.b
    // 1.b each result goes into the lexer (keywords + ?) => 2.a
    // 2.a each result goes into the parser => 3.a
    // 3.a each result goes into ? IR generator ? => 4.a
    // 4.a each result goes into ? optimiser ? => 4.b
    // 4.b each result goes into ? object generator ? => 5.a
    // 5.a each result goes into ? linker ? => 6

    // 6   ? end result ?

    process.exitCode = 0;
};

main(process.argv.slice(2));
