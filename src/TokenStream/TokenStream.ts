
import { EOFError } from "@/Error";
import { IToken } from "@/Token";

export default class TokenStream {
    private index = 0;
    private storage = 0;

    get eof(): boolean {
        return this.index >= this.stream.length;
    }

    constructor(private readonly stream: IToken[]) {

    }

    public next(): IToken {
        if (this.eof) {
            throw new EOFError(`reached end of token stream at index: '${this.index}'`);
        }

        return this.stream[this.index++];
    }

    public peek(): IToken {
        return this.stream[this.index];
    }

    public consume() {
        this.next();
    }

    public save() {
        this.storage = this.index;
    }

    public restore() {
        this.index = this.storage;
    }
}
