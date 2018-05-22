
import { CharacterStream } from "@/CharacterStream";
import { EOFError } from "@/Error";

export function parseSingleLineComment(stream: CharacterStream) {
    try {
        while (stream.next() !== "\n") {; }
    } catch (e) {
        if (!(e instanceof EOFError)) {
            throw e;
        }
    }
}

export default parseSingleLineComment;
