import TypeInfo from "./TypeInfo";

export default interface IntegerTypeInfo extends TypeInfo<number> {
    signed: boolean;
    width: 8 | 16 | 32 | 64;
}
