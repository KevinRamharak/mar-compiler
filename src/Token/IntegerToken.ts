
import { IToken, TokenMeta, TokenType } from ".";
import { IntegerTypeInfo } from "../TypeInfo";

export default class IntegerToken implements IToken<number, IntegerTypeInfo> {

    public readonly type = TokenType.IntegerLiteral;
    /**
     * @NOTE: the value member represents the bits as an unsigned number, the actual representation depends on the type info
     */
    constructor(public readonly value: number, public readonly info: IntegerTypeInfo, public readonly meta: TokenMeta) { }
}
