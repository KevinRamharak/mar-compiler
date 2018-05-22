export enum TokenType {
    LeftBrace, RightBrace,
    LeftParen, RightParen,
    LessThan, GreaterThan,
    LeftBracket, RightBracket,
    SemiColon, Colon,
    QuestionMark,
    Equals, NotEquals, And, Or, Not,
    PlusAssign, MinusAssign, MultiplyAssign, DivideAssign, ModuloAssign,
    Increment, Decrement,
    LeftShift, RightShift,
    LeftShiftAssign, RightShiftAssign,
    BitOr, BitNot, BitXor, /* BitAnd === Ampersand */
    BitOrAssign, BitAndAssign, BitXorAssign,
    Modulo, Assign,
    Plus, Minus, Star,
    Slash, BackSlash,
    Ampersand,
    Dot, Comma,
    Keyword, Identifier,
    BooleanLiteral,
    IntegerLiteral,
    FloatLiteral,
    CharacterLiteral,
    StringLiteral,
    Hash,
}

export default TokenType;
