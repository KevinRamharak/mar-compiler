import { IToken, TokenType } from '@/Token';
import { TokenStream } from '@/TokenStream';

export interface ParseResult {
    // ast: Node,
    warnings: string[];
    errors: string[];
}

export function parse(tokens: IToken[]): void;
export function parse(tokens: TokenStream): void;
export function parse(tokens: IToken[] | TokenStream): ParseResult {
    const stream: TokenStream =
        tokens instanceof TokenStream ? tokens : new TokenStream(tokens);

    const warnings: string[] = [];
    const errors: string[] = [];

    // const ast = new Node();

    while (!stream.eof) {
        const token = stream.next();
    }

    return {
        // ast,
        errors,
        warnings,
    };
}

export default parse;
