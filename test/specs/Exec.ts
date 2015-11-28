import { exec } from 'process-promises';

var testdata = require('../testdata.json');

describe('exec', () => {
    describe('node test/executable.js', () => {
        it('should emit child process', done => {
            let childProcess;

            exec('node test/executable.js')
                .on('process', process => childProcess = process)
                .then(result => {
                    expect(childProcess).not.toBeUndefined();
                }, err => fail(err))
                .finally(done);
        });

        it('should return with stdout', done => {
            exec('node test/executable.js')
                .then(result => {
                    expect(result.stdout).toEqual(testdata.stdout.map(l => l + '\n').join(''));
                }, err => fail(err))
                .finally(done);
        });

        it('should return with stderr', done => {
            exec('node test/executable.js')
                .then(result => {
                    expect(result.stderr).toEqual(testdata.stderr.map(l => l + '\n').join(''));
                }, err => fail(err))
                .finally(done);
        });
    });
});