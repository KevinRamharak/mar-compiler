import { addNewlineIfNeeded } from './addNewlineIfNeeded';
import { escapeCharacterMap } from './escapeCharacterMap';
import { parseFloatToken } from './parseFloatToken';
import { parseMultiLineComment } from './parseMultiLineComment';
import { parseNumberToken } from './parseNumberToken';
import { parseSingleLineComment } from './parseSingleLineComment';
import { parseStringLiteral } from './parseStringLiteral';
import { preProcess, PreProcessorResult } from './preProcess';
import { removeBackslashNewlineSequences } from './removeBackslashNewlineSequences';
import { sequences } from './sequences';
import { tokenize, TokenizerResult } from './tokenize';

export {
    addNewlineIfNeeded,
    escapeCharacterMap,
    parseFloatToken,
    parseMultiLineComment,
    parseNumberToken,
    parseSingleLineComment,
    parseStringLiteral,
    preProcess,
    PreProcessorResult,
    removeBackslashNewlineSequences,
    sequences,
    tokenize,
    TokenizerResult,
};
