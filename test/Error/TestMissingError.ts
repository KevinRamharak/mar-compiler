
export default class TestMissingError extends Error {
    public readonly name = "TestMissingError";

    constructor() {
        super("this test has not been implemented yet");
    }
}

export {
    TestMissingError,
};
