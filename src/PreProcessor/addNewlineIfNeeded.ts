
/**
 * If a non-empty source file does not end with a newline character after this step (whether it had no newline originally, or it ended with a backslash), the behavior is undefined.
 */
export function addNewlineIfNeeded(input: string): string {
    // check if source file is not empty
    if (input) {
        // if last character is not a newline add it
        if (input[input.length - 1] !== "\n") {
            input += "\n";
        }
    }
    return input;
}

export default addNewlineIfNeeded;
