import { Dict } from '../util';

import { IToken } from '@/Token';

import {
    addNewlineIfNeeded,
    performPreProcessing,
    PreProcessorResult,
    removeBackslashNewlineSequences,
    tokenize,
} from '.';

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

    const phase_4 = performPreProcessing(phase_3, preDefined, filename);

    return phase_4;
}

export default preProcess;
