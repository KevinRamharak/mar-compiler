import { CharacterStream } from '@/CharacterStream';
import { TokenType } from '@/Token';

export class CharacterSequence {
    get length() {
        return this.sequence.length;
    }
    constructor(
        public readonly sequence: string,
        public readonly type: TokenType
    ) {}
    public test(char: string, stream: CharacterStream) {
        const word = char + stream.lookahead(this.length - char.length) || '';
        return word === this.sequence;
    }
}

export default CharacterSequence;
