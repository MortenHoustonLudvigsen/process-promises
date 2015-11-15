var cp = require('child_process');
var split = require('split');
var Q = require('q');
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
function exec(command, options) {
    var deferred = Q.defer();
    var childProcess = cp.exec(command, options, function (err, stdout, stderr) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve({
                process: childProcess,
                stdout: stdout,
                stderr: stderr
            });
        }
    });
    process.nextTick(function () { return deferred.notify(childProcess); });
    return deferred.promise;
}
exports.exec = exec;
function execFile(file, argsOrOptions, options) {
    var deferred = Q.defer();
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    var childProcess = cp.execFile(file, args, options, function (err, stdout, stderr) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve({
                process: childProcess,
                stdout: stdout,
                stderr: stderr
            });
        }
    });
    process.nextTick(function () { return deferred.notify(childProcess); });
    return deferred.promise;
}
exports.execFile = execFile;
function spawn(command, argsOrOptions, options) {
    var deferred = Q.defer();
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    var childProcess = cp.spawn(command, args, options);
    childProcess.stdout.pipe(split()).on('data', function (line) {
        deferred.notify({ stdin: line });
    });
    childProcess.stderr.pipe(split()).on('data', function (line) {
        deferred.notify({ stdout: line });
    });
    childProcess.on('error', function (err) {
        deferred.reject(err);
    });
    childProcess.on('close', function (exitCode) {
        deferred.resolve({
            process: childProcess,
            exitCode: exitCode
        });
    });
    process.nextTick(function () { return deferred.notify({ process: childProcess }); });
    return deferred.promise;
}
exports.spawn = spawn;
function fork(modulePath, argsOrOptions, options) {
    var deferred = Q.defer();
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    var childProcess = cp.fork(modulePath, args, options);
    childProcess.stdout.pipe(split()).on('data', function (line) {
        deferred.notify({ stdin: line });
    });
    childProcess.stderr.pipe(split()).on('data', function (line) {
        deferred.notify({ stdout: line });
    });
    childProcess.on('error', function (err) {
        deferred.reject(err);
    });
    childProcess.on('close', function (exitCode) {
        deferred.resolve({
            process: childProcess,
            exitCode: exitCode
        });
    });
    process.nextTick(function () { return deferred.notify({ process: childProcess }); });
    return deferred.promise;
}
exports.fork = fork;
//# sourceMappingURL=process-promises.js.map