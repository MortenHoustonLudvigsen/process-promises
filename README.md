# process-promises
Node child processes as promises

# Installation
```
npm install process-promises --save
```

# exec

Runs a command in a shell and buffers the output.

## Usage - TypeScript

```typescript
import { exec } from 'process-promises';

exec('node ./node_modules/gulp/bin/gulp.js default')
    .on('process', process => console.log('Pid: ', process.pid))
    .then(result => {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .fail(err => {
        console.error('ERROR: ', err);
    });
```

## Usage - JavaScript

```javascript
var exec = require('process-promises').exec;

exec('node ./node_modules/gulp/bin/gulp.js default')
    .on('process', function(process) {
        console.log('Pid: ', process.pid); 
    })
    .then(function (result) {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .fail(function (err) {
        console.error('ERROR: ', err);
    });
```

## Syntax

```typescript
/**
 * Runs a command in a shell and buffers the output.
 * @param command {string} - The command
 * @param options {ExecOptions} - Options
 * @returns {PromiseWithEvents<ExecResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback}
 */
function exec(command: string, options?: ExecOptions): PromiseWithEvents<ExecResult>;

interface ExecOptions {
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

interface ExecResult {
    /** The standard output emitted from the process as a string */
    stdout: string;
    /** The standard error emitted from the process as a string */
    stderr: string;
}
```

# execFile

This is similar to exec() except it does not execute a subshell but rather the specified
file directly. This makes it slightly leaner than exec().

## Usage - TypeScript

```typescript
import { execFile } from 'process-promises';

execFile(process.execPath, ['./node_modules/gulp/bin/gulp.js', 'default'])
    .on('process', process => console.log('Pid: ', process.pid))
    .then(result => {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .fail(err => {
        console.error('ERROR: ', err);
    });
```

## Usage - JavaScript

```javascript
var execFile = require('process-promises').execFile;

execFile(process.execPath, ['./node_modules/gulp/bin/gulp.js', 'default'])
    .on('process', function(process) {
        console.log('Pid: ', process.pid); 
    })
    .then(function (result) {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .fail(function (err) {
        console.error('ERROR: ', err);
    });
```

## Syntax

```typescript
/**
 * This is similar to exec() except it does not execute a subshell but rather the specified
 * file directly. This makes it slightly leaner than exec().
 * @param file {string} - The file to execute
 * @param args {string[]} - List of string arguments
 * @param options {ExecFileOptions} - Options
 * @returns {PromiseWithEvents<ExecResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback}
 */
function execFile(file: string, options?: ExecFileOptions): PromiseWithEvents<ExecResult>;
function execFile(file: string, args?: string[], options?: ExecFileOptions): PromiseWithEvents<ExecResult>;

interface ExecFileOptions {
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

interface ExecResult {
    /** The standard output emitted from the process as a string */
    stdout: string;
    /** The standard error emitted from the process as a string */
    stderr: string;
}
```

# spawn

Launches a new process with the given command, with command line arguments in args. If
omitted, args defaults to an empty Array.
 
## Usage - TypeScript

```typescript
import { spawn } from 'process-promises';

spawn(process.execPath, ['./node_modules/gulp/bin/gulp.js', 'default'])
    .on('process', process => console.log('Pid: ', process.pid))
    .on('stdout', line => console.log('stdout: ', line))
    .on('stderr', line => console.log('stderr: ', line))
    .then(result => {
        console.log('Exit code: ' + result.exitCode);
    })
    .fail(err => {
        console.error('ERROR: ', err);
    });
```

## Usage - JavaScript

```javascript
var execFile = require('process-promises').execFile;

spawn(process.execPath, ['./node_modules/gulp/bin/gulp.js', 'default'])
    .on('process', function(process) {
        console.log('Pid: ', process.pid);
    })
    .on('stdout', function(line) {
        console.log('stdout: ', line); 
    })
    .on('stderr', function(line) {
        console.log('stdout: ', line); 
    })
    .then(function (result) {
        console.log('Exit code: ' + result.exitCode);
    })
    .fail(function (err) {
        console.error('ERROR: ', err);
    });
```

## Syntax

```typescript
/**
 * Launches a new process with the given command, with command line arguments in args. If
 * omitted, args defaults to an empty Array.
 * @param command {string} - The file to execute
 * @param args {string[]} - List of string arguments
 * @param options {SpawnOptions} - Options
 * @returns {PromiseWithEvents<SpawnResult>}
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options}
 */
function spawn(command: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
function spawn(command: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;

interface SpawnOptions {
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

interface SpawnResult {
    /** The exit code, if the process exited normally. */
    exitCode: number;
}
```

# fork

Launches a new node process with the given module, with command line arguments in args. If
omitted, args defaults to an empty Array.

The module is resolved using the [node require.resolve() algorithm](http://nodejs.org/docs/v0.4.8/api/all.html#all_Together)

This function calls spawn - not [child_process.fork](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)

## Usage - TypeScript

```typescript
import { fork } from 'process-promises';

fork('gulp/bin/gulp.js', ['default'])
    .on('process', process => console.log('Pid: ', process.pid))
    .on('stdout', line => console.log('stdout: ', line))
    .on('stderr', line => console.log('stderr: ', line))
    .then(result => {
        console.log('Exit code: ' + result.exitCode);
    })
    .fail(err => {
        console.error('ERROR: ', err);
    });
```

## Usage - JavaScript

```javascript
var execFile = require('process-promises').execFile;

fork('gulp/bin/gulp.js', ['default'])
    .on('process', function(process) {
        console.log('Pid: ', process.pid);
    })
    .on('stdout', function(line) {
        console.log('stdout: ', line); 
    })
    .on('stderr', function(line) {
        console.log('stdout: ', line); 
    })
    .then(function (result) {
        console.log('Exit code: ' + result.exitCode);
    })
    .fail(function (err) {
        console.error('ERROR: ', err);
    });
```

## Syntax

```typescript
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
function fork(modulePath: string, options?: SpawnOptions): PromiseWithEvents<SpawnResult>;
function fork(modulePath: string, args?: string[], options?: SpawnOptions): PromiseWithEvents<SpawnResult>;

interface SpawnOptions {
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

interface SpawnResult {
    /** The exit code, if the process exited normally. */
    exitCode: number;
}
```

