import { spawn } from 'process-promises';

var testdata = require('../testdata.json');

describe('spawn', () => {
    describe('node test/executable.js', () => {
        it('should emit child process', done => {
            let childProcess;
            
            spawn('node', ['test/executable.js'])
                .on('process', process => childProcess = process)
                .then(result => {
                    expect(childProcess).not.toBeUndefined();
                    expect(childProcess).not.toBeNull();
                }, err => fail(err))
                .finally(done);
        });

        it('should emit stdout', done => {
            let lines = [];
            
            spawn('node', ['test/executable.js'])
                .on('stdout', line => lines.push(line))
                .then(result => {
                    expect(lines).toEqual(testdata.stdout);
                }, err => fail(err))
                .finally(done);
        });

        it('should emit stderr', done => {
            let lines = [];
            
            spawn('node', ['test/executable.js'])
                .on('stderr', line => lines.push(line))
                .then(result => {
                    expect(lines).toEqual(testdata.stderr);
                }, err => fail(err))
                .finally(done);
        });

        it('should return with exit code 0', done => {
            spawn('node', ['test/executable.js'])
                .then(result => {
                    expect(result.exitCode).toBe(0);
                }, err => fail(err))
                .finally(done);
        });
    });
});