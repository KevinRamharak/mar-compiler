import TypeInfo from "./TypeInfo";

export default interface FloatTypeInfo extends TypeInfo<number> {
    width: 32 | 64;
}
