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

                next = stream.peek();
                // #TODO: see above link and https://en.wikipedia.org/wiki/Hexadecimal#Rational_numbers and https://github.com/dankogai/js-hexfloat
                if (next === '.' || next === 'p' || next === 'P') {
                    throw new NotImplementedError(
                        'invalid floating point literal :: hexadecimal floating point is not implemented yet'
                    );
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
