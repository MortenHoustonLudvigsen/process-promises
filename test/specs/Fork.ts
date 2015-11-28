import { fork } from 'process-promises';

var testdata = require('../testdata.json');

describe('fork', () => {
    describe('test/executable.js', () => {
        it('should emit child process', done => {
            let childProcess;
            
            fork('../executable.js')
                .on('process', process => childProcess = process)
                .then(result => {
                    expect(childProcess).not.toBeUndefined();
                }, err => fail(err))
                .finally(done);
        });

        it('should emit stdout', done => {
            let lines = [];
            
            fork('../executable.js')
                .on('stdout', line => lines.push(line))
                .then(result => {
                    expect(lines).toEqual(testdata.stdout);
                }, err => fail(err))
                .finally(done);
        });

        it('should emit stderr', done => {
            let lines = [];
            
            fork('../executable.js')
                .on('stderr', line => lines.push(line))
                .then(result => {
                    expect(lines).toEqual(testdata.stderr);
                }, err => fail(err))
                .finally(done);
        });

        it('should return with exit code 0', done => {
            fork('../executable.js')
                .then(result => {
                    expect(result.exitCode).toBe(0);
                }, err => fail(err))
                .finally(done);
        });
    });
});