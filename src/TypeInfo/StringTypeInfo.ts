import TypeInfo from "./TypeInfo";

export default interface StringTypeInfo extends TypeInfo<Buffer> {
    length: number;
}
