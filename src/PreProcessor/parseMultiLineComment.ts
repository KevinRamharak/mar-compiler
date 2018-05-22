import { CharacterStream } from "@/CharacterStream";

export function parseMultiLineComment(stream: CharacterStream) {
    let level = 1;
    while (level !== 0) {
        const c = stream.next();
        const d = stream.peek();
        if (c === "/" && d === "*") {
            stream.consume();
            level++;
        } else if (c === "*" && d === "/") {
            stream.consume();
            level--;
        }
    }
}

export default parseMultiLineComment;
