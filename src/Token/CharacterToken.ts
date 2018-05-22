
import { IToken, TokenMeta, TokenType } from ".";
import { StringTypeInfo } from "../TypeInfo";

export default class CharacterToken implements IToken<Buffer, StringTypeInfo> {
    public readonly type = TokenType.CharacterLiteral;
    constructor(public readonly value: Buffer, public readonly info: StringTypeInfo, public readonly meta: TokenMeta) { }
}
