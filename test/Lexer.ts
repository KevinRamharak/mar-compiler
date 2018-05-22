import { deepStrictEqual } from "assert";
import { assert } from "chai";
import { describe, it } from "mocha";

import { lex } from "@/Lexer";

import { BooleanToken, CharacterToken, FloatToken, IntegerToken, StringToken, Token, TokenType } from "@/Token";

import { PreProcessorError } from "@/Error";

import { TestMissingError } from "@test/Error";
import { TypeOf } from "@test/util";

// tslint:disable:object-literal-sort-keys

describe("Lexer", () => {
    // TokenMeta object to use for each token
    const meta = {
        column: 1,
        filename: "[test]",
        line: 1,
    };

    // basic
    it('should accept a string and return a "LexResult"', () => {
        const result: any = lex("int main() { return 0; }", "[test]");
        assert(typeof result === "object", `expected 'result' to be an 'object', instead got '${typeof result}'`);
        assert(Array.isArray(result.tokens), `expected 'result.tokens' to be an 'Array', instead got '${TypeOf(result.tokens)}'`);
        assert(Array.isArray(result.warnings), `expected 'result.warnings' to be an 'Array', instead got '${TypeOf(result.warnings)}'`);
        assert(Array.isArray(result.errors), `expected 'result.errors' to be an 'Array', instead got '${TypeOf(result.errors)}'`);
    });

    // comments
    it("should ignore single line comments (with 'preProcessed' option off)", () => {
        const result = lex("// this should be ignored", "[test]", false);
        assert(result.tokens.length === 0, `expected '0' tokens, instead got '${result.tokens.length}'`);
    });
    it("should ignore multiline comments (with 'preProcessed' option off)", () => {
        const result = lex("/* a \n b \n c \n ok */", "[test]", false);
        assert(result.tokens.length === 0, `expected '0' tokens, instead got '${result.tokens.length}'`);
    });
    it("should ignore nested multiline comments (with 'preProcessed' options off)", () => {
        const result = lex("/* first part /* second part */ /* second part /* third part */*/*/", "[test]", false);
        assert(result.tokens.length === 0, `expected '0' tokens, instead got '${result.tokens.length}'`);
    });

    // pre processor
    it("should throw when the file is not preprocessed and a preprocessor/compiler directive is found", () => {
        try {
            const result = lex('#include "somefile.h"', "[test]");
        } catch (e) {
            assert(e instanceof PreProcessorError, `expected 'PreProcessorError', instead got '${(e as Error).name}'`);
        }
    });

    // tokens
    it("should parse single character tokens correctly", () => {
        const tests: { [key: string]: TokenType } = {
            "+": TokenType.Plus,
            "-": TokenType.Minus,
            "*": TokenType.Star,
            "/": TokenType.Slash,
            "{": TokenType.LeftBrace,
            "}": TokenType.RightBrace,
            "[": TokenType.LeftBracket,
            "]": TokenType.RightBracket,
            "(": TokenType.LeftParen,
            ")": TokenType.RightParen,
            "<": TokenType.LessThan,
            ">": TokenType.GreaterThan,
            ";": TokenType.SemiColon,
            ":": TokenType.Colon,
            "?": TokenType.QuestionMark,
            "=": TokenType.Assign,
            "!": TokenType.Not,
            "|": TokenType.BitOr,
            "^": TokenType.BitXor,
            "~": TokenType.BitNot,
            "&": TokenType.Ampersand,
            "%": TokenType.Modulo,
            "\\": TokenType.BackSlash,
            ".": TokenType.Dot,
            ",": TokenType.Comma,
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === tests[token.value as string], `expected '${TokenType[tests[keys[i]]]}' instead got '${TokenType[token.type]}'`);
        });

    });
    it("should parse multi character tokens correctly", () => {
        const tests: { [key: string]: TokenType } = {
            "++": TokenType.Increment,
            "+=": TokenType.PlusAssign,
            "--": TokenType.Decrement,
            "-=": TokenType.MinusAssign,
            "*=": TokenType.MultiplyAssign,
            "/=": TokenType.DivideAssign,
            "%=": TokenType.ModuloAssign,
            "!=": TokenType.NotEquals,
            "==": TokenType.Equals,
            "&=": TokenType.BitAndAssign,
            "^=": TokenType.BitXorAssign,
            "|=": TokenType.BitOrAssign,
            ">>": TokenType.RightShift,
            "<<": TokenType.LeftShift,
            "&&": TokenType.And,
            "||": TokenType.Or,
            ">>=": TokenType.RightShiftAssign,
            "<<=": TokenType.LeftShiftAssign,
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === tests[token.value as string], `expected '${TokenType[tests[keys[i]]]}' instead got '${TokenType[token.type]}'`);
        });
    });

    // literals:
    // integers
    it("should parse binary integer literals correctly", () => {
        // NOTE: eventough the 'value' members are unsigned, the extra type info should fix it in later stages
        const tests: { [key: string]: IntegerToken } = {
            "0b": new IntegerToken(0, { width: 16, signed: true }, meta),
            "0b00000000": new IntegerToken(0, { width: 16, signed: true }, meta),
            "0b00000001u": new IntegerToken(1, { width: 16, signed: false }, meta),
            "0b11110000l": new IntegerToken(240, { width: 32, signed: true }, meta),
            "0b10101010ul": new IntegerToken(170, { width: 32, signed: false }, meta),
            "0b11111111ll": new IntegerToken(255, { width: 64, signed: true }, meta),
            "0b01101101ull": new IntegerToken(109, { width: 64, signed: false }, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        // for the '0b'
        assert(result.errors.length === 1, `expected '1' error, instead got '${result.errors.length}' errors`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.IntegerLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.IntegerLiteral', instead got '${TokenType[token.type]}'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'IntegerTypeInfo'`);
        });
    });

    it("should parse octal integer literals correctly", () => {
        const tests: { [key: string]: IntegerToken } = {
            "0": new IntegerToken(0, { width: 16, signed: true }, meta),
            "010u": new IntegerToken(8, { width: 16, signed: false }, meta),
            "0100l": new IntegerToken(64, { width: 32, signed: true }, meta),
            "01234567ul": new IntegerToken(342391, { width: 32, signed: false }, meta),
            "07777777ll": new IntegerToken(2097151, { width: 64, signed: true }, meta),
            "076543217654321ull": new IntegerToken(4308292557009, { width: 64, signed: false }, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.IntegerLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.IntegerLiteral', instead got '${TokenType[token.type]}'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'IntegerTypeInfo'`);
        });
    });

    it("should parse decimal integer literals correctly", () => {
        const tests: { [key: string]: IntegerToken } = {
            "25": new IntegerToken(25, { width: 16, signed: true }, meta),
            "43u": new IntegerToken(43, { width: 16, signed: false }, meta),
            "128l": new IntegerToken(128, { width: 32, signed: true }, meta),
            "32014ul": new IntegerToken(32014, { width: 32, signed: false }, meta),
            "4912804ll": new IntegerToken(4912804, { width: 64, signed: true }, meta),
            "1203902193ull": new IntegerToken(1203902193, { width: 64, signed: false }, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.IntegerLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.IntegerLiteral'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'IntegerTypeInfo'`);
        });
    });

    it("should parse hexadecimal integer literals correctly", () => {
        const tests: { [key: string]: IntegerToken } = {
            "0x": new IntegerToken(0, { width: 16, signed: true }, meta),
            "0x20": new IntegerToken(32, { width: 16, signed: true }, meta),
            "0x0Au": new IntegerToken(10, { width: 16, signed: false }, meta),
            "0xBEEFl": new IntegerToken(0xBEEF, { width: 32, signed: true }, meta),
            "0xABCDEFul": new IntegerToken(0xABCDEF, { width: 32, signed: false }, meta),
            "0xFFFFFFFFll": new IntegerToken(0xFFFFFFFF, { width: 64, signed: true }, meta),
            "0x0F0Full": new IntegerToken(0x0F0F, { width: 64, signed: false }, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        // for the '0x'
        assert(result.errors.length === 1, `expected '1' error, instead got '${result.errors.length}' errors`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.IntegerLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.IntegerLiteral', instead got '${TokenType[token.type]}'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'IntegerTypeInfo'`);
        });
    });

    // floats
    it("should parse decimal floating point literals correctly", () => {
        const tests: { [key: string]: FloatToken } = {
            "0.": new FloatToken(0, { width: 64 }, meta),
            ".0": new FloatToken(0, { width: 64 }, meta),
            "0.f": new FloatToken(0, { width: 32 }, meta),
            ".0f": new FloatToken(0, { width: 32 }, meta),
            "0.1f": new FloatToken(0.1, { width: 32 }, meta),
            "0.1": new FloatToken(0.1, { width: 64 }, meta),
            "1203.3123f": new FloatToken(1203.3123, { width: 32 }, meta),
            "81249.1242142": new FloatToken(81249.1242142, { width: 64 }, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.FloatLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.FloatLiteral', instead got '${TokenType[token.type]}'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'FloatTypeInfo'`);
        });
    });

    // booleans
    it("should parse boolean literals correctly", () => {
        const tests: { [key: string]: BooleanToken } = {
            true: new BooleanToken(true, meta),
            false: new BooleanToken(false, meta),
        };

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.BooleanLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.BooleanLiteral', instead got '${TokenType[token.type]}'`);
            assert(token.value === tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'BooleanTypeInfo'`);
        });
    });

    // strings
    it("should parse character literals correctly", () => {
        const literals: string[] = [
            "c",
            "more characters is possible but makes no sense for a programmer to use",
            "a string with \n some \n newlines [note: these are actual 0x0A chars]",
        ];

        const tests: { [key: string]: CharacterToken } = {
            /* escape characters */
            "'\\a'": new CharacterToken(Buffer.from([0x7]), { length: 1 }, meta),
            "'\\b'": new CharacterToken(Buffer.from([0x8]), { length: 1 }, meta),
            "'\\f'": new CharacterToken(Buffer.from([0xc]), { length: 1 }, meta),
            "'\\n'": new CharacterToken(Buffer.from([0xa]), { length: 1 }, meta),
            "'\\r'": new CharacterToken(Buffer.from([0xd]), { length: 1 }, meta),
            "'\\t'": new CharacterToken(Buffer.from([0x9]), { length: 1 }, meta),
            "'\\v'": new CharacterToken(Buffer.from([0xb]), { length: 1 }, meta),
            "'\\''": new CharacterToken(Buffer.from([0x27]), { length: 1 }, meta),
            "'\"'": new CharacterToken(Buffer.from([0x22]), { length: 1 }, meta),
            "'\\?'": new CharacterToken(Buffer.from([0x3f]), { length: 1 }, meta),
            "'\\e'": new CharacterToken(Buffer.from([0x1b]), { length: 1 }, meta),
            "'\\\\'": new CharacterToken(Buffer.from([0x5c]), { length: 1 }, meta),
            /* octal */
            "'\\0'": new CharacterToken(Buffer.from([0]), { length: 1 }, meta),
            "'\\40'": new CharacterToken(Buffer.from([0o40]), { length: 1 }, meta),
            /* hex */
            "'\\xFF'": new CharacterToken(Buffer.from([0xFF]), { length: 1 }, meta),
            "'\\xFFFF'": new CharacterToken(Buffer.from([0xFF, 0xFF]), { length: 2 }, meta),
            "'\\xABCD'": new CharacterToken(Buffer.from([0xAB, 0xCD]), { length: 2 }, meta),
            /* unicode 4 hexes */
            /* #NOTE: These depend on target encoding */
            // "\\uABCD": new CharacterToken(Buffer.from([/* ... */]), { length: /* ... */}, meta)
            /* unicode 8 hexes */
            /* #NOTE: These depend on target encoding */
            // "\\uABCDEF90": new CharacterToken(Buffer.from([/* ... */]), { length: /* ... */}, meta)
        };

        literals.forEach((literal) => {
            tests[`'${literal}'`] = new CharacterToken(Buffer.from(literal), { length: literal.length }, meta);
        });

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.CharacterLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.CharacterLiteral', instead got '${TokenType[token.type]}'`);
            deepStrictEqual(token.value, tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'CharacterTypeInfo'`);
        });
    });
    it("should parse string literals correctly", () => {
        const literals: string[] = [
            "c",
            "some longer string",
            "a string with \n some \n newlines [note: these are actual 0x0A chars]",
        ];

        const tests: { [key: string]: StringToken } = {
            /* escape characters */
            '"\\a"': new StringToken(Buffer.from([0x7]), { length: 1 }, meta),
            '"\\b"': new StringToken(Buffer.from([0x8]), { length: 1 }, meta),
            '"\\f"': new StringToken(Buffer.from([0xc]), { length: 1 }, meta),
            '"\\n"': new StringToken(Buffer.from([0xa]), { length: 1 }, meta),
            '"\\r"': new StringToken(Buffer.from([0xd]), { length: 1 }, meta),
            '"\\t"': new StringToken(Buffer.from([0x9]), { length: 1 }, meta),
            '"\\v"': new StringToken(Buffer.from([0xb]), { length: 1 }, meta),
            '"\\\'"': new StringToken(Buffer.from([0x27]), { length: 1 }, meta),
            '"\\""': new StringToken(Buffer.from([0x22]), { length: 1 }, meta),
            '"\\?"': new StringToken(Buffer.from([0x3f]), { length: 1 }, meta),
            '"\\e"': new StringToken(Buffer.from([0x1b]), { length: 1 }, meta),
            '"\\\\"': new StringToken(Buffer.from([0x5c]), { length: 1 }, meta),
            /* octal */
            '"\\0"': new StringToken(Buffer.from([0]), { length: 1 }, meta),
            '"\\40"': new StringToken(Buffer.from([0o40]), { length: 1 }, meta),
            /* hex */
            '"\\xFF"': new StringToken(Buffer.from([0xFF]), { length: 1 }, meta),
            '"\\xFFFF"': new StringToken(Buffer.from([0xFF, 0xFF]), { length: 2 }, meta),
            '"\\xABCD"': new StringToken(Buffer.from([0xAB, 0xCD]), { length: 2 }, meta),
            /* unicode 4 hexes */
            /* #NOTE: These depend on target encoding */
            // "\\uABCD": new CharacterToken(Buffer.from([/* ... */]), { length: /* ... */}, meta)
            /* unicode 8 hexes */
            /* #NOTE: These depend on target encoding */
            // "\\uABCDEF90": new CharacterToken(Buffer.from([/* ... */]), { length: /* ... */}, meta)
        };

        literals.forEach((literal) => {
            tests[`"${literal}"`] = new StringToken(Buffer.from(literal), { length: literal.length }, meta);
        });

        const keys = Object.keys(tests);
        const testString = keys.join(" ");
        const result = lex(testString, "[test]");

        assert(keys.length === result.tokens.length, `expected '${keys.length}' amount of tokens, instead got '${result.tokens.length}'`);

        result.tokens.forEach((token, i) => {
            assert(token.type === TokenType.StringLiteral, `expected '${keys[i]}' to result into 'token.type' of 'TokenType.StringLiteral', instead got '${TokenType[token.type]}'`);
            deepStrictEqual(token.value, tests[keys[i]].value, `expected '${keys[i]}' to result into 'token.value' of '${tests[keys[i]].value}', instead got '${token.value}'`);
            deepStrictEqual(token.info, tests[keys[i]].info, `expected '${keys[i]}' to result in a specific 'CharacterTypeInfo'`);
        });

    });
});
