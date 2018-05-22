import { Dict } from '../util';

import { IToken } from '@/Token';

import {
    addNewlineIfNeeded,
    removeBackslashNewlineSequences,
    tokenize,
} from '.';

export interface PreProcessorResult {
    tokens: IToken[];
    filename: string;
    warnings: string[];
    errors: string[];
}

/**
 * does the first 4 phases of http://en.cppreference.com/w/c/language/translation_phases
 */
export function preProcess(
    content: string,
    filename: string = '[string]',
    preDefined: Dict = {}
): PreProcessorResult {
    const warnings: string[] = [];
    const errors: string[] = [];

    /* #NOTE: phase 1 will probably never be implemented */
    // const phase_1a = mapCharacters(content);
    // const phase_1b = replaceTrigraphSequences(phase1a);

    const phase_2a = removeBackslashNewlineSequences(content);
    const phase_2b = addNewlineIfNeeded(phase_2a);

    const phase_3 = tokenize(phase_2b, filename);

    warnings.push(...phase_3.warnings);
    errors.push(...phase_3.errors);

    // const phase_4 = performPreProcessing(phase_3, preDefined);

    return {
        errors,
        filename,
        tokens: phase_3.tokens,
        warnings,
    };
}

export default preProcess;
