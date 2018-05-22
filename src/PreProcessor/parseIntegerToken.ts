import { CharacterStream } from "@/CharacterStream";
import { IntegerToken, TokenMeta } from "@/Token";

export function parseIntegerToken(prefix: string, stream: CharacterStream, meta: TokenMeta) {
    return new IntegerToken(0, { width: 16, signed: true }, meta);
}

export default parseIntegerToken;
