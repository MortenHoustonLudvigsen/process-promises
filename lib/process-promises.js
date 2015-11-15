var path = require('path');
var cp = require('child_process');
var Q = require('q');
var split = require('split');
var resolve_promise_1 = require('./resolve-promise');
var caller_1 = require('./caller');
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
                stdout: stdout.toString(),
                stderr: stderr.toString()
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
                stdout: stdout.toString(),
                stderr: stderr.toString()
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
        deferred.notify({ stdout: line });
    });
    childProcess.stderr.pipe(split()).on('data', function (line) {
        deferred.notify({ stderr: line });
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
    var basedir = path.dirname(caller_1.caller());
    var args = getArgs(argsOrOptions) || [];
    options = getOptions(argsOrOptions, options);
    if (/^\.{0,2}\//.test(modulePath)) {
        var filePath = path.resolve(basedir, modulePath);
        return spawn(process.execPath, [filePath].concat(args), options);
    }
    return resolve_promise_1.resolve(modulePath, { basedir: basedir })
        .then(function (filePath) { return spawn(process.execPath, [filePath].concat(args), options); });
}
exports.fork = fork;
//# sourceMappingURL=process-promises.js.map