
import { CharacterStream } from "@/CharacterStream";
import { TokenType } from "@/Token";

// tslint:disable:object-literal-sort-keys
export const sequenceMap: { [key: string]: TokenType } = {
    "{": TokenType.LeftBrace, "}": TokenType.RightBrace,
    "[": TokenType.LeftBracket, "]": TokenType.RightBracket,
    "(": TokenType.LeftParen, ")": TokenType.RightParen,
    ";": TokenType.SemiColon,
    ":": TokenType.Colon,
    ",": TokenType.Comma,
    "?": TokenType.QuestionMark,
    "\\": TokenType.BackSlash,
    "~": TokenType.BitNot,
    "*": TokenType.Star, "*=": TokenType.MultiplyAssign,
    "/": TokenType.Slash, "/=": TokenType.DivideAssign,
    "!": TokenType.Not, "!=": TokenType.NotEquals,
    "=": TokenType.Assign, "==": TokenType.Equals,
    "%": TokenType.Modulo, "%=": TokenType.ModuloAssign,
    "^": TokenType.BitXor, "^=": TokenType.BitXorAssign,
    "|": TokenType.BitOr, "&&": TokenType.And, "|=": TokenType.BitOrAssign,
    "&": TokenType.Ampersand, "||": TokenType.Or, "&=": TokenType.BitAndAssign,
    "+": TokenType.Plus, "++": TokenType.Increment, "+=": TokenType.PlusAssign,
    "-": TokenType.Minus, "--": TokenType.Decrement, "-=": TokenType.MinusAssign,
    "<": TokenType.LessThan, "<<": TokenType.LeftShift, "<<=": TokenType.LeftShiftAssign,
    ">": TokenType.GreaterThan, ">>": TokenType.RightShift, ">>=": TokenType.RightShiftAssign,
};

export class CharacterSequence {
    get length() { return this.sequence.length; }
    constructor(public readonly sequence: string, public readonly type: TokenType) { }
    public test(char: string, stream: CharacterStream) {
        const word = char + stream.lookahead(this.length - 1) || "";
        return word === this.sequence;
    }
}

export const sequences = Object.entries(sequenceMap).map((entry) => {
    return new CharacterSequence(entry[0], entry[1]);
}).sort((a, b) => {
    return b.length - a.length; // sorted by length descending
});

export default sequences;
