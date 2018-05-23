import { CharacterStream } from '@/CharacterStream';
import {
    InvalidFloatTokenError,
    InvalidIntegerTokenError,
    NotImplementedError,
} from '@/Error';
import { FloatToken, IntegerToken, TokenMeta } from '@/Token';
import { character, parseHexadecimalFloat } from '@/util';
import { parseFloatToken } from '.';

/**
 * see: http://en.cppreference.com/w/c/language/integer_constant
 * see: http://en.cppreference.com/w/c/language/floating_constant
 */
export function parseNumberToken(
    char: string,
    stream: CharacterStream,
    meta: TokenMeta
): IntegerToken | FloatToken {
    let word = '';
    let next = '';
    let radix = 10;
    let width: 16 | 32 | 64 = 16;
    let signed = true;

    if (char === '0') {
        next = stream.peek();
        switch (next) {
            case '.':
                return parseFloatToken(char + stream.next(), stream, meta);
            case 'b':
            case 'B':
                stream.consume();
                radix = 2;
                while (character.is.binary(stream.peek())) {
                    word += stream.next();
                }
                if (!word) {
                    throw new InvalidIntegerTokenError(
                        'invalid binary integer literal :: no binary digits found'
                    );
                }
                break;
            case 'x':
            case 'X':
                stream.consume();
                radix = 16;
                while (character.is.hexadecimal(stream.peek())) {
                    word += stream.next();
                }

                if (!word) {
                    throw new InvalidIntegerTokenError(
                        'invalid hexadecimal integer literal :: no hexadecimal digits found'
                    );
                }

                let float = false;
                next = stream.peek();
                if (next === '.') {
                    stream.consume();
                    float = true;
                    while (character.is.hexadecimal(stream.peek())) {
                        word = stream.next();
                    }
                    next = stream.peek();
                }

                let exponentialSign = false;
                let exponential = '';
                if (next === 'p' || next === 'P') {
                    stream.consume();
                    exponentialSign = true;
                    float = true;
                    while (character.is.digit(stream.peek())) {
                        exponential += stream.next();
                    }
                }

                if (float && !exponentialSign) {
                    throw new InvalidFloatTokenError(
                        `invalid hexadecimal float literal :: missing exponential sign 'p' for '${word}'`
                    );
                }

                if (float) {
                    if (!exponential) {
                        throw new InvalidFloatTokenError(
                            `invalid hexadecimal float literal :: missing exponential for '${word}'`
                        );
                    }
                    const floatVal = parseHexadecimalFloat(word, exponential);

                    next = stream.peek();
                    if (next === 'f' || next === 'F') {
                        stream.consume();
                        width = 32;
                    } else {
                        width = 64;
                    }
                    return new FloatToken(floatVal, { width }, meta);
                }
                break;
            default:
                word = char;
                radix = 8;
                while (character.is.octal(stream.peek())) {
                    word += stream.next();
                }
                break;
        }
    } else {
        word = char;
        while (character.is.digit(stream.peek())) {
            word += stream.next();
        }
        next = stream.peek();
        if (next === '.' || next === 'e' || next === 'E') {
            return parseFloatToken(word + stream.next(), stream, meta);
        }
        if (next === 'f' || next === 'F') {
            return parseFloatToken(word + next, stream, meta);
        }
    }
    /* suffix */
    next = stream.peek();

    if (next === 'u' || next === 'U') {
        stream.consume();
        next = stream.peek();
        signed = false;
    }
    if (next === 'l' || next === 'L') {
        const type = stream.next();
        next = stream.peek();
        width = next === type ? 64 : 32;
    }

    const value = Number.parseInt(word, radix);
    return new IntegerToken(value, { width, signed }, meta);
}

export default parseNumberToken;
