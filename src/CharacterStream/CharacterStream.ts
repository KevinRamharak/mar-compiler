import { EOFError } from '@/Error';

export default class CharacterStream {
    private index = 0;
    private _line = 1;
    private _column = 1;
    private storage = {
        column: 1,
        index: 0,
        line: 1,
    };

    get line(): number {
        return this._line;
    }
    get column(): number {
        return this._column;
    }

    get eof(): boolean {
        return this.index >= this.content.length;
    }

    constructor(private readonly content: string) {}

    public next(): string {
        if (this.eof) {
            throw new EOFError(
                `reached end of file at ${this.line}:${this.column}`
            );
        }
        const char = this.content[this.index++];
        if (char === '\n') {
            this.newLine();
        } else {
            this._column++;
        }
        return char;
    }

    public peek(): string {
        return this.content[this.index];
    }

    public lookahead(length: number): string {
        return this.content.substr(this.index, length);
    }

    public consume(): void {
        this.next();
    }

    public save() {
        this.storage.index = this.index;
        this.storage.line = this.line;
        this.storage.column = this.column;
    }

    public restore() {
        this.index = this.storage.index;
        this._line = this.storage.line;
        this._column = this.storage.column;
    }

    private newLine(): void {
        this._line++;
        this._column = 1;
    }
}
