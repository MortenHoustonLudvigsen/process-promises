﻿import * as path from 'path';
import * as stream from "stream";
import * as cp from 'child_process';
import split = require('split');
import { resolve } from './resolve-promise';
import { caller } from './caller';
import { PromiseWithEvents } from './PromiseWithEvents';

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

function readStreamAsLines(stream: stream.Readable, event: string, eventEmitter: NodeJS.EventEmitter) {
    let lastLineEmpty = false;
    stream.pipe(split()).on('data', function(line: string): void {
        if (line === '') {
            if (lastLineEmpty) eventEmitter.emit(event, '');
            lastLineEmpty = true;
        } else {
            if (lastLineEmpty) eventEmitter.emit(event, '');
            lastLineEmpty = false;
            eventEmitter.emit(event, line);
        }
    });
}

export interface ExecOptions {
    /** Current working directory of the child process */
    cwd?: string;
    /** Object Environment key-value pairs */
    env?: any;
    /** Encoding - default: 'utf8' */
    encoding?: string;
    /**
     * Shell to execute the command with (Default: '/bin/sh' on UNIX, 'cmd.exe' on Windows, The shell
     * should understand the -c switch on UNIX or /s /c on Windows. On Windows, command line parsing
     * should be compatible with cmd.exe.)
     */
    shell?: string;
    /** Time out - default: 0 */
    timeout?: number;
    /**
     * Largest amount of data (in bytes) allowed on stdout or stderr - if exceeded child process is
     * killed - default: 200*1024
     */
    maxBuffer?: number;
    /** Kill signal - default: 'SIGTERM' */
    killSignal?: string;
}


export interface ExecResult {
    /** The standard output emitted from the process as a string */
    stdout: string;
    /** The standard error emitted from the process as a string */
    stderr: string;
}

/**
 * Runs a command in a shell and buffers the output.
 * @param command {string} - The command  
 * @param options {ExecOptions} - Options
 * @returns {PromiseWithEvents<ExecResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback}
 */
export function exec(command: string, options?: ExecOptions): PromiseWithEvents<ExecResult> {
    return new PromiseWithEvents<ExecResult>((resolve, reject, eventEmitter) => {
        let childProcess = cp.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
                });
            }
        });
        process.nextTick(() => eventEmitter.emit('process', childProcess));
    });
}


export interface ExecFileOptions {
    /** Current working directory of the child process */
    cwd?: string;
    /** Object Environment key-value pairs */
    env?: any;
    /** Encoding - default: 'utf8' */
    encoding?: string;
    /** Time out - default: 0 */
    timeout?: number;
    /**
     * Largest amount of data (in bytes) allowed on stdout or stderr - if exceeded child process is
     * killed - default: 200*1024
     */
    maxBuffer?: number;
    /** Kill signal - default: 'SIGTERM' */
    killSignal?: string;
}

/**
 * This is similar to exec() except it does not execute a subshell but rather the specified
 * file directly. This makes it slightly leaner than exec().
 * @param file {string} - The file to execute
 * @param args {string[]} - List of string arguments
 * @param options {ExecFileOptions} - Options
 * @returns {PromiseWithEvents<ExecResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback}
 */
export function execFile(file: string, options?: ExecFileOptions): PromiseWithEvents<ExecResult>;
export function execFile(file: string, args?: string[], options?: ExecFileOptions): PromiseWithEvents<ExecResult>;
export function execFile(file: string, argsOrOptions?: string[] | ExecFileOptions, options?: ExecFileOptions): PromiseWithEvents<ExecResult> {
    let args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    return new PromiseWithEvents<ExecResult>((resolve, reject, eventEmitter) => {
        let childProcess = cp.execFile(file, args, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
                });
            }
        });
        process.nextTick(() => eventEmitter.emit('process', childProcess));
    });
}

export interface SpawnOptions {
    /** Current working directory of the child process */
    cwd?: string;
    /** Object Environment key-value pairs */
    env?: any;
    /**
     * Child's stdio configuration
     * @see {@link https://nodejs.org/api/child_process.html#child_process_options_stdio}
     */
    stdio?: string | [
        string | NodeJS.WritableStream | number,
        string | NodeJS.ReadableStream | number,
        string | NodeJS.ReadableStream | number
    ];
    /**
     * Prepare child to run independently of its parent process. Specific behavior depends on the platform
     * @see {@link https://nodejs.org/api/child_process.html#child_process_options_detached}
     */
    detached?: boolean;
}

export interface SpawnResult {
    /** The exit code, if the process exited normally. */
    exitCode: number;
}

/**
 * Launches a new process with the given command, with command line arguments in args. If
 * omitted, args defaults to an empty Array.
 * @param command {string} - The file to execute
 * @param args {string[]} - List of string arguments
 * @param options {SpawnOptions} - Options
 * @returns {PromiseWithEvents<SpawnResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options}
 */
export function spawn(command: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export function spawn(command: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export function spawn(command: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions): PromiseWithEvents<SpawnResult> {
    let args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    return new PromiseWithEvents<SpawnResult>((resolve, reject, eventEmitter) => {
        let childProcess = cp.spawn(command, args, options);

        readStreamAsLines(childProcess.stdout, 'stdout', eventEmitter);
        readStreamAsLines(childProcess.stderr, 'stderr', eventEmitter);

        childProcess.on('error', function(err: any): void {
            reject(err);
        });

        childProcess.on('close', function(exitCode: number): void {
            resolve({ exitCode: exitCode });
        });

        process.nextTick(() => eventEmitter.emit('process', childProcess));
    });
}

/**
 * Launches a new node process with the given module, with command line arguments in args. If
 * omitted, args defaults to an empty Array.
 * The module is resolved using the {@link http://nodejs.org/docs/v0.4.8/api/all.html#all_Together|node require.resolve() algorithm}
 * This function calls spawn - not {@link https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options|child_process.fork}
 * @param modulePath {string} - The module to execute with node
 * @param args {string[]} - List of string arguments
 * @param options {SpawnOptions} - Options
 * @returns {PromiseWithEvents<SpawnResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options}
 */
export function fork(modulePath: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export function fork(modulePath: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export function fork(modulePath: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions): PromiseWithEvents<SpawnResult> {
    let basedir = path.dirname(caller());
    let args = getArgs(argsOrOptions) || [];
    options = getOptions(argsOrOptions, options);

    if (/^\.{0,2}\//.test(modulePath)) {
        var filePath = path.resolve(basedir, modulePath);
        return spawn(process.execPath, [filePath].concat(args), options);
    }

    let promise = resolve(modulePath, { basedir: basedir })
        .then(filePath => spawn(process.execPath, [filePath].concat(args), options));

    return <PromiseWithEvents<SpawnResult>>promise;
}
