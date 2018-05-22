
import { IToken, TokenMeta, TokenType } from ".";
import { BooleanTypeInfo } from "../TypeInfo";

export default class BooleanToken implements IToken<boolean, BooleanTypeInfo> {
    public readonly type = TokenType.BooleanLiteral;
    public readonly info = {};
    constructor(public readonly value: boolean, public readonly meta: TokenMeta) { }
}
