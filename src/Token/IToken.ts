
import { TokenMeta, TokenType } from ".";
import { TypeInfo } from "../TypeInfo";

export default interface IToken<T extends string | boolean | number | Buffer = string | boolean | number | Buffer, R extends TypeInfo = TypeInfo> {
    readonly type: TokenType;
    readonly value: T;
    readonly meta: TokenMeta;
    readonly info?: R;
}
