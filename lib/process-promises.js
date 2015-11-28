var path = require('path');
var cp = require('child_process');
var split = require('split');
var resolve_promise_1 = require('./resolve-promise');
var caller_1 = require('./caller');
var PromiseWithEvents_1 = require('./PromiseWithEvents');
function getArgs(argsOrOptions) {
    if (argsOrOptions instanceof Array) {
        return argsOrOptions;
    }
}
function getOptions(argsOrOptions, options) {
    if (argsOrOptions instanceof Array) {
        return options;
    }
    else {
        return argsOrOptions;
    }
}
function readStreamAsLines(stream, event, eventEmitter) {
    var lastLineEmpty = false;
    stream.pipe(split()).on('data', function (line) {
        if (line === '') {
            if (lastLineEmpty)
                eventEmitter.emit(event, '');
            lastLineEmpty = true;
        }
        else {
            if (lastLineEmpty)
                eventEmitter.emit(event, '');
            lastLineEmpty = false;
            eventEmitter.emit(event, line);
        }
    });
}
/**
 * Runs a command in a shell and buffers the output.
 * @param command {string} - The command
 * @param options {ExecOptions} - Options
 * @returns {PromiseWithEvents<ExecResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback}
 */
function exec(command, options) {
    return new PromiseWithEvents_1.PromiseWithEvents(function (resolve, reject, eventEmitter) {
        var childProcess = cp.exec(command, options, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
                });
            }
        });
        process.nextTick(function () { return eventEmitter.emit('process', childProcess); });
    });
}
exports.exec = exec;
function execFile(file, argsOrOptions, options) {
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    return new PromiseWithEvents_1.PromiseWithEvents(function (resolve, reject, eventEmitter) {
        var childProcess = cp.execFile(file, args, options, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
                });
            }
        });
        process.nextTick(function () { return eventEmitter.emit('process', childProcess); });
    });
}
exports.execFile = execFile;
function spawn(command, argsOrOptions, options) {
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    return new PromiseWithEvents_1.PromiseWithEvents(function (resolve, reject, eventEmitter) {
        var childProcess = cp.spawn(command, args, options);
        readStreamAsLines(childProcess.stdout, 'stdout', eventEmitter);
        readStreamAsLines(childProcess.stderr, 'stderr', eventEmitter);
        childProcess.on('error', function (err) {
            reject(err);
        });
        childProcess.on('close', function (exitCode) {
            resolve({ exitCode: exitCode });
        });
        process.nextTick(function () { return eventEmitter.emit('process', childProcess); });
    });
}
exports.spawn = spawn;
function fork(modulePath, argsOrOptions, options) {
    var basedir = path.dirname(caller_1.caller());
    var args = getArgs(argsOrOptions) || [];
    options = getOptions(argsOrOptions, options);
    if (/^\.{0,2}\//.test(modulePath)) {
        var filePath = path.resolve(basedir, modulePath);
        return spawn(process.execPath, [filePath].concat(args), options);
    }
    var promise = resolve_promise_1.resolve(modulePath, { basedir: basedir })
        .then(function (filePath) { return spawn(process.execPath, [filePath].concat(args), options); });
    return promise;
}
exports.fork = fork;
//# sourceMappingURL=process-promises.js.map