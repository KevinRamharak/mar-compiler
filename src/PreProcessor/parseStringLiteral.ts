import { CharacterStream } from '@/CharacterStream';
import { InvalidStringTokenError } from '@/Error';
import { escapeCharacterMap } from '@/PreProcessor';
import { CharacterToken, StringToken, TokenMeta } from '@/Token';
import { character, intToBytes } from '@/util';

const escapes = Object.keys(escapeCharacterMap);

export function parseStringLiteral(
    type: '"',
    stream: CharacterStream,
    meta: TokenMeta
): CharacterToken | StringToken {
    const word: number[] = [];

    while (type !== stream.peek()) {
        const char = stream.next();
        if (char === '\\') {
            const next = stream.peek();

            if (escapes.includes(next)) {
                stream.consume();
                const value = escapeCharacterMap[next];
                word.push(value);
            } else {
                switch (next) {
                    case 'u':
                        stream.consume();
                        /* 4 hex unicode point */
                        // #NOTE: this depends on the target encoding
                        // #NOTE: assume utf-8 target encoding

                        let codepoint_32 = '';
                        for (let i = 0; i < 4; i++) {
                            if (character.is.hexadecimal(stream.peek())) {
                                codepoint_32 += stream.next();
                            } else {
                                throw new InvalidStringTokenError(
                                    `invalid escape sequence in literal string :: expected 4 hexadecimal digits following '\\u', instead got '${
                                        codepoint_32.length
                                    }'`
                                );
                            }
                        }

                        const value_32 = Number.parseInt(codepoint_32, 16);
                        const encodedChar_32 = String.fromCodePoint(value_32);
                        const bytes_32 = Buffer.from(encodedChar_32);
                        word.push(...bytes_32);

                        break;
                    case 'U':
                        stream.consume();
                        /* 8 hex unicode point */
                        // #NOTE: this depends on the target encoding
                        // #NOTE: assume utf-8 target encoding

                        let codepoint_64 = '';
                        for (let i = 0; i < 8; i++) {
                            if (character.is.hexadecimal(stream.peek())) {
                                codepoint_64 += stream.next();
                            } else {
                                throw new InvalidStringTokenError(
                                    `invalid escape sequence in literal string :: expected 8 hexadecimal digits following '\\U', instead got '${
                                        codepoint_64.length
                                    }'`
                                );
                            }
                        }

                        const codepoint_64_1 = codepoint_64.slice(0, 4);
                        const codepoint_64_2 = codepoint_64.slice(4);
                        const value_64 =
                            (Number.parseInt(codepoint_64_1, 16) << 16) |
                            Number.parseInt(codepoint_64_2, 16);
                        const encodedChar_64 = String.fromCodePoint(value_64);
                        const bytes_64 = Buffer.from(encodedChar_64);
                        word.push(...bytes_64);

                        break;
                    case 'x':
                        /* hex escape */
                        stream.consume();

                        let hex = '';
                        while (character.is.hexadecimal(stream.peek())) {
                            hex += stream.next();
                        }

                        if (!hex) {
                            throw new InvalidStringTokenError(
                                `invalid escape sequence in literal string :: expected at least 1 hexadecimal digit following the sequence '\\x', found 0`
                            );
                        }

                        while (hex) {
                            const sub = hex.slice(0, 8);
                            // tslint:disable
                            const value = Number.parseInt(sub, 16);
                            const bytes = intToBytes(value);
                            // tslint:enable
                            word.push(...bytes);
                            hex = hex.slice(8);
                        }

                        break;
                    default:
                        /* octal */
                        let octal = '';
                        while (character.is.octal(stream.peek())) {
                            octal += stream.next();
                            if (octal.length === 3) {
                                break;
                            }
                        }

                        if (!octal) {
                            throw new InvalidStringTokenError(
                                `invalid escape sequence in literal string :: expected valid escape character, instead got ${stream.next()}`
                            );
                        }

                        const value = Number.parseInt(octal, 8);
                        const bytes = intToBytes(value);
                        word.push(...bytes);

                        break;
                }
            }
        } else {
            const value = char.charCodeAt(0);
            const bytes = intToBytes(value);
            word.push(...bytes);
        }
    }
    stream.consume();
    const buffer = Buffer.from(word);
    const info = { length: buffer.length };
    return new StringToken(buffer, info, meta);
}

export default parseStringLiteral;
