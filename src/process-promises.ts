import * as path from 'path';
import * as cp from 'child_process';
import * as Q from 'q';
import split = require('split');
import { resolve } from './resolve-promise';
import { caller } from './caller';

function getArgs<TOptions>(argsOrOptions?: string[] | TOptions): string[] {
    if (argsOrOptions instanceof Array) {
        return argsOrOptions;
    }
}

function getOptions<TOptions>(argsOrOptions?: string[] | TOptions, options?: TOptions): TOptions {
    if (argsOrOptions instanceof Array) {
        return options;
    } else {
        return <TOptions>argsOrOptions;
    }
}

export interface ExecOptions {
    cwd?: string;
    stdio?: any;
    customFds?: any;
    env?: any;
    encoding?: string;
    timeout?: number;
    maxBuffer?: number;
    killSignal?: string;
}

export interface ExecResult {
    stdout: string;
    stderr: string;
}

export function exec(command: string, options?: ExecOptions): Q.Promise<ExecResult> {
    let deferred = Q.defer<ExecResult>();

    let childProcess = cp.exec(command, options, function(err: Error, stdout: Buffer, stderr: Buffer): void {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({
                stdout: stdout.toString(),
                stderr: stderr.toString()
            });
        }
    });

    process.nextTick(() => deferred.notify(childProcess));
    return deferred.promise;
}


export function execFile(file: string, options?: ExecOptions): Q.Promise<ExecResult>;
export function execFile(file: string, args?: string[], options?: ExecOptions): Q.Promise<ExecResult>;
export function execFile(file: string, argsOrOptions?: string[] | ExecOptions, options?: ExecOptions): Q.Promise<ExecResult> {
    let deferred = Q.defer<ExecResult>();
    let args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);

    let childProcess = cp.execFile(file, args, options, function(err: Error, stdout: Buffer, stderr: Buffer): void {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({
                stdout: stdout.toString(),
                stderr: stderr.toString()
            });
        }
    });

    process.nextTick(() => deferred.notify(childProcess));

    return deferred.promise;
}

export interface SpawnOptions {
    cwd?: string;
    env?: any;
    stdio?: string | [
        string | NodeJS.WritableStream | number,
        string | NodeJS.ReadableStream | number,
        string | NodeJS.ReadableStream | number
    ];
    detached?: boolean;
}

export interface SpawnResult {
    process: cp.ChildProcess;
    exitCode: number;
}

export function spawn(command: string, options?: SpawnOptions): Q.Promise<SpawnResult>;
export function spawn(command: string, args?: string[], options?: SpawnOptions): Q.Promise<SpawnResult>;
export function spawn(command: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions): Q.Promise<SpawnResult> {
    let deferred = Q.defer<SpawnResult>();
    let args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);

    let childProcess = cp.spawn(command, args, options);

    childProcess.stdout.pipe(split()).on('data', function(line: string): void {
        deferred.notify({ stdout: line });
    });

    childProcess.stderr.pipe(split()).on('data', function(line: string): void {
        deferred.notify({ stderr: line });
    });

    childProcess.on('error', function(err: any): void {
        deferred.reject(err);
    });

    childProcess.on('close', function(exitCode: number): void {
        deferred.resolve({
            process: childProcess,
            exitCode: exitCode
        });
    });

    process.nextTick(() => deferred.notify({ process: childProcess }));
    return deferred.promise;
}


export function fork(modulePath: string, options?: SpawnOptions): Q.Promise<SpawnResult>;
export function fork(modulePath: string, args?: string[], options?: SpawnOptions): Q.Promise<SpawnResult>;
export function fork(modulePath: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions): Q.Promise<SpawnResult> {
    let basedir = path.dirname(caller());
    let args = getArgs(argsOrOptions) || [];
    options = getOptions(argsOrOptions, options);
    
    if (/^\.{0,2}\//.test(modulePath)){
        var filePath = path.resolve(basedir, modulePath);
        return spawn(process.execPath, [filePath].concat(args), options);
    } 
    return resolve(modulePath, { basedir: basedir })
        .then(filePath => spawn(process.execPath, [filePath].concat(args), options));
}
