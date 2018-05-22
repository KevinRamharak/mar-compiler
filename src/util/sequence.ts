
import { character } from ".";

const sequence = {
    is: {
        identifier(word: string): boolean {
            if (!character.is.identifierStart(word[0])) {
                return false;
            }
            for (const c of word) {
                if (!character.is.identifierChar(c)) {
                    return false;
                }
            }
            return true;
        },
    },
};

export default sequence;
