import { IToken, TokenMeta, TokenType } from '.';
import { CharacterTypeInfo } from '../TypeInfo';

export default class CharacterToken
    implements IToken<Buffer, CharacterTypeInfo> {
    public readonly type = TokenType.CharacterLiteral;
    constructor(
        public readonly value: Buffer,
        public readonly info: CharacterTypeInfo,
        public readonly meta: TokenMeta
    ) {}
}
