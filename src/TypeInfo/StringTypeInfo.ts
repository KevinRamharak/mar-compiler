import { TypeInfo } from '.';

export default interface StringTypeInfo extends TypeInfo<Buffer> {
    length: number;
}
