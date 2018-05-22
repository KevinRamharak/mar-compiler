import { CharacterStream } from '@/CharacterStream';
import { NotImplementedError } from '@/Error';
import { FloatToken, TokenMeta } from '@/Token';
import { character } from '@/util';

export function parseFloatToken(
    prefix: string,
    stream: CharacterStream,
    meta: TokenMeta
): FloatToken {
    let word = '';
    let width: 32 | 64 = 64;

    while (character.is.digit(stream.peek())) {
        word += stream.next();
    }

    let next = stream.peek();
    if (next === 'e' || next === 'E') {
        word += stream.next();
        while (character.is.digit(stream.peek())) {
            word += stream.next();
        }
        next = stream.peek();
    }
    if (next === 'f' || next === 'F') {
        stream.consume();
        next = stream.peek();
        width = 32;
    }
    if (next === 'l' || next === 'L') {
        throw new NotImplementedError(
            "invalid floating point literal :: the type 'long double' is not yet supported"
        );
    }

    const value = Number.parseFloat(prefix + word);
    return new FloatToken(value, { width }, meta);
}

export default parseFloatToken;
