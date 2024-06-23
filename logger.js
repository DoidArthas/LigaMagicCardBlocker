function logThat(owner, message, break1 = '', break2 = '') {
    let callerName = "unknown";

    // Instead of accessing caller, you can use Error().stack to get the call stack
    const stack = new Error().stack;
    if (stack) {
        // Extract caller function name from stack trace
        const callerLine = stack.split('\n')[2]; // Adjust index as needed
        if (callerLine) {
            callerName = callerLine.trim();
        }
    }

    message = break1 + owner.toUpperCase() + ': ' + message + " (" + callerName + ")" + break2;

    console.log(message);
}
