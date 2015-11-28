import * as cp from 'child_process';
import { PromiseWithEvents } from './PromiseWithEvents';
export interface ExecProgress {
    /** The executing process */
    process?: cp.ChildProcess;
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
export declare function exec(command: string, options?: ExecOptions): PromiseWithEvents<ExecResult>;
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
export declare function execFile(file: string, options?: ExecFileOptions): PromiseWithEvents<ExecResult>;
export declare function execFile(file: string, args?: string[], options?: ExecFileOptions): PromiseWithEvents<ExecResult>;
export interface SpawnOptions {
    /** Current working directory of the child process */
    cwd?: string;
    /** Object Environment key-value pairs */
    env?: any;
    /**
     * Child's stdio configuration
     * @see {@link https://nodejs.org/api/child_process.html#child_process_options_stdio}
     */
    stdio?: string | [string | NodeJS.WritableStream | number, string | NodeJS.ReadableStream | number, string | NodeJS.ReadableStream | number];
    /**
     * Prepare child to run independently of its parent process. Specific behavior depends on the platform
     * @see {@link https://nodejs.org/api/child_process.html#child_process_options_detached}
     */
    detached?: boolean;
}
export interface SpawnProgress {
    /** The executing process */
    process?: cp.ChildProcess;
    /** One line of from the process' standard output */
    stdout?: string;
    /** One line of from the process' standard error */
    stderr?: string;
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
 * @returns {Promise<SpawnResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options}
 */
export declare function spawn(command: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export declare function spawn(command: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
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
export declare function fork(modulePath: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
export declare function fork(modulePath: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
