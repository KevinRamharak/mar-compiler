
import { IToken, TokenMeta, TokenType } from ".";
import { StringTypeInfo } from "../TypeInfo";

export default class StringToken implements IToken<Buffer, StringTypeInfo> {
    public readonly type = TokenType.StringLiteral;
    constructor(public readonly value: Buffer, public readonly info: StringTypeInfo, public readonly meta: TokenMeta) { }
}
