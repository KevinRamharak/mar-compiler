import { deepStrictEqual } from 'assert';
import { assert } from 'chai';
import { describe, it } from 'mocha';

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
import { preProcess, PreProcessorResult } from '@/PreProcessor';

import { TestMissingError } from '@test/Error';
import { TypeOf } from '@test/util';

describe('Parser', () => {
    // it("This test Suite should be implemented", () => {
    //     throw new TestMissingError();
    // });
});
