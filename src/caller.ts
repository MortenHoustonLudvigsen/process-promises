import stackTrace = require('stack-trace');

export function caller() {
    var stack = stackTrace.get();
    return stack[2].getFileName();
};
