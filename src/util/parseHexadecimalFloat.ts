export function parseHexadecimalFloat(
    word: string,
    exponential: string
): number {
    const floatWords = word.split('.');
    if (floatWords.length === 2) {
        const values = floatWords.map(f => Number.parseInt(f, 16));
        return Number.parseFloat(values.join('.') + 'e' + exponential);
    } else if (floatWords.length === 1) {
        const value = Number.parseInt(floatWords[0], 16);
        return Number.parseFloat(value + 'e' + exponential);
    } else {
        throw new TypeError(
            `'floatWords' has to have a length of '1' or '2', instead got '${
                floatWords.length
            }'`
        );
    }
}

export default parseHexadecimalFloat;
