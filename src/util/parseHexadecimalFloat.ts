import { NotImplementedError } from '@/Error';

export function parseHexadecimalFloat(
    word: string,
    exponential: string
): number {
    const [before, after = ''] = word.split('.');

    const pre = Number.parseInt(before, 16);
    let post = 0;

    for (let i = 0; i < after.length; i++) {
        const value = Number.parseInt(after[i], 16);
        const e = 16 ** (i + 1);
        post += value / e;
    }

    const total = `${pre}.${post.toString().slice(2)}e${exponential}`;
    //tslint:disable
    console.log(total);

    return Number.parseFloat(total);
}

/**
 * 0.2301 === 0 + 2/10 + 2/100 + 0 / 1000 + 1 / 10000
 * 0x0.2301
 */

export default parseHexadecimalFloat;
