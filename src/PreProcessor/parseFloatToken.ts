import { CharacterStream } from "@/CharacterStream";
import { FloatToken, TokenMeta, TokenType } from "@/Token";

export function parseFloatToken(prefix: string, stream: CharacterStream, meta: TokenMeta): FloatToken {
    return new FloatToken(0, { width: 64 }, meta);
}

export default parseFloatToken;
