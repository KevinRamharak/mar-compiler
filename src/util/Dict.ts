
export interface Dict<R = string> {
    [key: string]: R;
    [key: number]: R;
}

export default Dict;
