import * as cp from 'child_process';
import * as Q from 'q';
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
export declare function exec(command: string, options?: ExecOptions): Q.Promise<ExecResult>;
export declare function execFile(file: string, options?: ExecOptions): Q.Promise<ExecResult>;
export declare function execFile(file: string, args?: string[], options?: ExecOptions): Q.Promise<ExecResult>;
export interface SpawnOptions {
    cwd?: string;
    env?: any;
    stdio?: string | [string | NodeJS.WritableStream | number, string | NodeJS.ReadableStream | number, string | NodeJS.ReadableStream | number];
    detached?: boolean;
}
export interface SpawnResult {
    process: cp.ChildProcess;
    exitCode: number;
}
export declare function spawn(command: string, options?: SpawnOptions): Q.Promise<SpawnResult>;
export declare function spawn(command: string, args?: string[], options?: SpawnOptions): Q.Promise<SpawnResult>;
export declare function fork(modulePath: string, options?: SpawnOptions): Q.Promise<SpawnResult>;
export declare function fork(modulePath: string, args?: string[], options?: SpawnOptions): Q.Promise<SpawnResult>;
