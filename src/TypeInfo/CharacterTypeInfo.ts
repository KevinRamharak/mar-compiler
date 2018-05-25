import { TypeInfo } from '.';

export default interface CharacterTypeInfo extends TypeInfo<Buffer> {
    length: number;
    width: 8 | 16 | 32;
}
