import { CharacterStream } from '@/CharacterStream';
import { CharacterSequence } from '@/PreProcessor';
import { TokenType } from '@/Token';

export const instructionMap: { [key: string]: TokenType } = {
    define: TokenType.PreProcessDefine,
    elif: TokenType.PreProcessElif,
    else: TokenType.PreProcessElse,
    endif: TokenType.PreProcessEndif,
    error: TokenType.PreProcessError,
    if: TokenType.PreProcessIf,
    ifdef: TokenType.PreProcessIfdef,
    ifndef: TokenType.PreProcessIfndef,
    include: TokenType.PreProcessInclude,
    line: TokenType.PreProcessLine,
    pragma: TokenType.PreProcessPragma,
    undef: TokenType.PreProcessUndef,
};

export const instructions = Object.entries(instructionMap)
    .map(entry => {
        return new CharacterSequence(entry[0], entry[1]);
    })
    .sort((a, b) => {
        return b.length - a.length;
    });

export default instructions;
