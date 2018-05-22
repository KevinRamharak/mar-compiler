import { CharacterStream } from '@/CharacterStream';
import { InvalidIntegerTokenError, NotImplementedError } from '@/Error';
import { FloatToken, IntegerToken, TokenMeta } from '@/Token';
import { character } from '@/util';

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
                let afterDot = '';
                next = stream.peek();
                if (next === '.') {
                    stream.consume();
                    float = true;
                    while (character.is.hexadecimal(stream.peek())) {
                        afterDot = stream.next();
                    }
                }

                let exponential = '';
                if (next === 'p' || next === 'P') {
                    stream.consume();
                    float = true;
                    while (character.is.digit(stream.peek())) {
                        exponential += stream.consume();
                    }
                }

                if (float) {
                    let floatVal = parseInt(word, 16);
                    if (afterDot) {
                        floatVal += 16 / parseInt(afterDot, 16);
                    }
                    if (exponential) {
                        const exponentialVal = parseInt(exponential, 10);
                        floatVal = floatVal * 2 ** exponentialVal;
                    }
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
