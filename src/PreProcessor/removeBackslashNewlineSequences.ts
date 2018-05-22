
import { CharacterStream } from "@/CharacterStream";

/**
 * Whenever backslash appears at the end of a line (immediately followed by the newline character), both backslash and newline are deleted, combining two physical source lines into one logical source line. This is a single-pass operation: a line ending in two backslashes followed by an empty line does not combine three lines into one.
 */
export function removeBackslashNewlineSequences(input: string): string {
    const stream = new CharacterStream(input);
    let output = "";

    while (!stream.eof) {
        const char = stream.next();
        if (char === "\\" && stream.peek() === "\n") {
            stream.consume();
            continue;
        }
        output += char;
    }

    return output.trim();
}

export default removeBackslashNewlineSequences;
