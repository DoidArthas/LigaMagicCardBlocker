function logThat(owner, message, break1, break2){
    const caller = arguments.callee.caller;
    callerName = "unknown";

    if (caller) {
        // Access the name property of the calling function
        if(caller.name){
            callerName = caller.name;
        }
    }

    message = break1 + owner.toUpperCase() + ': ' + message + " (" + callerName + ")" + break2;

    console.log(message);
}