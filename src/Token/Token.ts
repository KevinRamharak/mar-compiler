
import { IToken, TokenMeta, TokenType } from ".";
import { TypeInfo } from "../TypeInfo";

export default class Token implements IToken<string> {
    constructor(public readonly type: TokenType, public readonly value: string, public readonly meta: TokenMeta) { }
}
