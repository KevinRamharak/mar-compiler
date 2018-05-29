import { CharacterStream } from '@/CharacterStream';
import { EOFError, InvalidIntegerTokenError, PreProcessorError } from '@/Error';
import { IToken, Token, TokenType } from '@/Token';
import { character } from '@/util';

import {
    instructions,
    parseCharacterLiteral,
    parseFloatToken,
    parseMultiLineComment,
    parseNumberToken,
    parseSingleLineComment,
    parseStringLiteral,
    sequences,
} from '.';

export interface TokenizerResult {
    tokens: IToken[];
    warnings: string[];
    errors: string[];
}

/**
 * The source file is decomposed into comments, sequences of whitespace characters (space, horizontal tab, new-line, vertical tab, and form-feed), and preprocessing tokens, which are the following
 *
 * - header names: <stdio.h> or "myfile.h"
 * - identifiers
 * - preprocessing numbers, which cover integer constants and floating constants, but also cover some invalid tokens such as 1..E+3.foo or 0JBK
 * - character constants and string literals
 * - operators and punctuators, such as +, <<=, <%, or ##.
 * - individual non-whitespace characters that do not fit in any other category
 *
 * Each comment is replaced by one space character
 *
 * Newlines are kept, and it's implementation-defined whether non-newline whitespace sequences may be collapsed into single space characters.
 */
export function tokenize(input: string, filename: string): TokenizerResult {
    const stream = new CharacterStream(input);

    const tokens: IToken[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // quick way to get the top token. imply a newline to handle pre processor instructions
    const top = () => {
        return tokens[tokens.length - 1] || { type: TokenType.NewLine };
    };

    tokenizing: while (!stream.eof) {
        const char = stream.next();
        // #TODO: rewrite parse*() functions so they dont need the meta parameter
        const meta = { filename, line: stream.line, column: stream.column };

        // skip whitespace
        if (character.is.whitespace(char)) {
            // newlines have to be preserved somehow
            if (char === '\n') {
                tokens.push(new Token(TokenType.NewLine, char, meta));
            }
            // rest of the whitespace can be shortend to a single space, its implementation defined
            continue;
        }

        // check for comments
        if (char === '/') {
            const next = stream.peek();
            if (next === '/') {
                stream.consume();
                parseSingleLineComment(stream);
                continue;
            } else if (next === '*') {
                stream.consume();
                parseMultiLineComment(stream);
                continue;
            }
        }

        if (char === '#') {
            // check if the previous token was a newline
            // this has to be true for a directive since all other whitespace is ignored
            if (top().type === TokenType.NewLine) {
                const next = stream.next();
                for (const instruction of instructions) {
                    if (instruction.test(next, stream)) {
                        for (let i = 1; i < instruction.length; i++) {
                            stream.consume();
                        }
                        const token = new Token(
                            instruction.type,
                            instruction.sequence,
                            meta
                        );
                        tokens.push(token);
                        continue tokenizing;
                    }
                }
                let ignore = char;
                while (stream.peek() !== '\n') {
                    ignore += stream.next();
                }
                throw new PreProcessorError(
                    `invalid preprocessor instruction :: ignoring '${ignore}' in '${filename}' at ${
                        meta.line
                    }:${meta.column}'`
                );
            } else if (stream.peek() === '#') {
                // #NOTE: Can this be used outside of a preprocessor instruction?
                tokens.push(
                    new Token(
                        TokenType.PreProcessConcat,
                        char + stream.next(),
                        meta
                    )
                );
            } else {
                // #NOTE: Can this be used outside of a preprocessor instruction?
                // because of: 'The null directive (# followed by a line break) is allowed and has no effect.'
                if (stream.peek() !== '\n') {
                    tokens.push(
                        new Token(TokenType.PreProcessStringizer, char, meta)
                    );
                }
            }
            continue;
        }

        for (const sequence of sequences) {
            if (sequence.test(char, stream)) {
                for (let i = 1; i < sequence.length; i++) {
                    stream.consume();
                }
                const token = new Token(sequence.type, sequence.sequence, meta);
                tokens.push(token);
                continue tokenizing;
            }
        }

        // we make a special case for '.' because it could be a floating point literal
        if (char === '.') {
            if (character.is.digit(stream.peek())) {
                const token = parseFloatToken(char, stream, meta);
                tokens.push(token);
            } else {
                // just a dot
                tokens.push(new Token(TokenType.Dot, char, meta));
            }
            continue;
        }

        // numbers -> integers & floats
        if (character.is.digit(char)) {
            try {
                const token = parseNumberToken(char, stream, meta);
                tokens.push(token);
            } catch (e) {
                if (!(e instanceof InvalidIntegerTokenError)) {
                    throw e;
                } else {
                    errors.push(e.message);
                }
            }
            continue;
        }

        /*
            TODO: http://en.cppreference.com/w/c/language/character_constant
            still need to get the 'u' | 'U' | 'L' prefix
        */
        if (char === "'") {
            const token = parseCharacterLiteral(char, stream, meta);
            tokens.push(token);
            continue;
        }

        /*
            TODO: http://en.cppreference.com/w/c/language/string_literal
            still need to get the 'u' | 'U' | 'L' prefix
        */
        if (char === '"') {
            const token = parseStringLiteral(char, stream, meta);
            tokens.push(token);
            continue;
        }
    }

    return {
        errors,
        tokens,
        warnings,
    };
}
