import { deepStrictEqual } from 'assert';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import { lex } from '@/Lexer';

import {
    BooleanToken,
    CharacterToken,
    FloatToken,
    IntegerToken,
    StringToken,
    Token,
    TokenType,
} from '@/Token';

import { PreProcessorError } from '@/Error';

import { TestMissingError } from '@test/Error';
import { TypeOf } from '@test/util';

// tslint:disable:object-literal-sort-keys

describe('Lexer', () => {
    //
});
