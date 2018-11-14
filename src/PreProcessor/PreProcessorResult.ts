import { IToken } from '@/Token';

export interface PreProcessorResult {
    tokens: IToken[];
    filename: string;
    warnings: string[];
    errors: string[];
}
