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
    process: cp.ChildProcess;
    stdout: Buffer;
    stderr: Buffer;
}
export declare function exec(command: string, options?: ExecOptions): Q.Promise<ExecResult>;
export declare function execFile(file: string, options?: ExecOptions): Q.Promise<ExecResult>;
export declare function execFile(file: string, args?: string[], options?: ExecOptions): Q.Promise<ExecResult>;
export interface SpawnOptions {
    cwd?: string;
    stdio?: any;
    custom?: any;
    env?: any;
    detached?: boolean;
}
export interface SpawnResult {
    process: cp.ChildProcess;
    exitCode: number;
}
export declare function spawn(command: string, options?: SpawnOptions): Q.Promise<SpawnResult>;
export declare function spawn(command: string, args?: string[], options?: SpawnOptions): Q.Promise<SpawnResult>;
export interface ForkOptions {
    cwd?: string;
    env?: any;
    encoding?: string;
}
export declare function fork(modulePath: string, options?: ForkOptions): Q.Promise<SpawnResult>;
export declare function fork(modulePath: string, args?: string[], options?: ForkOptions): Q.Promise<SpawnResult>;
