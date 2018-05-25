const charactersToEscape = ['"', "'", '?', '\\'];

const escapeCharacterMap: { [key: string]: number } = {
    a: 0x07,
    b: 0x08,
    e: 0x1b,
    f: 0x0c,
    n: 0x0a,
    r: 0x0d,
    t: 0x09,
    v: 0x0b,
};

for (const char of charactersToEscape) {
    escapeCharacterMap[char] = char.charCodeAt(0);
}

export { escapeCharacterMap };
export default escapeCharacterMap;
