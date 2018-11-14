import { Dict } from '../util';

import { IToken } from '@/Token';

import { PreProcessorResult, TokenizerResult } from '.';

export function performPreProcessing(
    tokenizeResult: TokenizerResult,
    preDefined: Dict,
    filename: string
): PreProcessorResult {
    const tokens: IToken[] = tokenizeResult.tokens;
    const warnings: string[] = tokenizeResult.warnings;
    const errors: string[] = tokenizeResult.errors;

    return {
        errors,
        filename,
        tokens,
        warnings,
    };
}
