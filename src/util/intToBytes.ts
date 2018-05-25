/**
 * turns an unsigned 32-bit integer into a sequence of bytes.
 */
export function intToBytes(int: number): number[] {
    if (int >= 2 ** 32) {
        throw new TypeError(
            `'int' cannot exceed a value of '${2 ** 32 -
                1}' (2 ** 32 - 1), instead got '${int}'`
        );
    }

    const bytes: number[] = [];

    if (int > 0xff0000) {
        const b32 = (int & 0xff000000) >> 24;
    }

    if (int > 0xff00) {
        const b24 = (int & 0xff0000) >> 16;
    }

    if (int > 0xff) {
        const b16 = (int & 0xff00) >> 8;
        bytes.push(b16);
    }

    const b8 = int & 0xff;
    bytes.push(b8);

    return bytes;
}

export default intToBytes;
