
import { CharacterStream } from "@/CharacterStream";
import { FloatToken, IntegerToken, TokenMeta } from "@/Token";
import { parseFloatToken, parseIntegerToken } from ".";

export function parseNumberToken(char: string, stream: CharacterStream, meta: TokenMeta) {
    return parseIntegerToken(char, stream, meta);
}

export default parseNumberToken;
