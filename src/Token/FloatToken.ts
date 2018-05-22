
import { IToken, TokenMeta, TokenType } from ".";
import { FloatTypeInfo } from "../TypeInfo";

export default class FloatToken implements IToken<number, FloatTypeInfo> {
    public readonly type = TokenType.FloatLiteral;
    constructor(public readonly value: number, public readonly info: FloatTypeInfo, public readonly meta: TokenMeta) { }
}
