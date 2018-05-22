
export const character = {
    is: {
        whitespace(char: string): boolean {
            return char === "\n" || char === "\r" || char === "\t" || char === "\v" || char.charCodeAt(0) === 0x0C || char === " ";
        },
        binary(char: string): boolean {
            return char === "0" || char === "1";
        },
        hexadecimal(char: string): boolean {
            return (char >= "0" && char <= "9") || (char >= "a" && char <= "f") || (char >= "A" && char <= "F");
        },
        octal(char: string): boolean {
            return (char >= "0" && char <= "7");
        },
        digit(char: string): boolean {
            return char >= "0" && char <= "9";
        },
        lowercase(char: string): boolean {
            return char >= "a" && char <= "z";
        },
        uppercase(char: string): boolean {
            return char >= "A" && char <= "Z";
        },
        printable(char: string): boolean {
            return char >= "";
        },
        alpha(char: string): boolean {
            return this.lowercase(char) || this.uppercase(char);
        },
        alphanumerical(char: string): boolean {
            return this.alpha(char) || this.digit(char);
        },
        identifierStart(char: string): boolean {
            return this.alpha(char) || char === "_";
        },
        identifierChar(char: string): boolean {
            return this.alphanumerical(char) || char === "_";
        },
    },
};

export default character;
