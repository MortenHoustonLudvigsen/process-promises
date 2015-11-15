var stackTrace = require('stack-trace');
function caller() {
    var stack = stackTrace.get();
    return stack[2].getFileName();
}
exports.caller = caller;
;
//# sourceMappingURL=caller.js.map