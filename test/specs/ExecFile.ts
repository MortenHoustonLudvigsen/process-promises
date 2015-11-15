import { execFile } from 'process-promises';

describe('execFile', () => {
    describe('node test/executable.js', () => {
        it('should not fail', done => {
            execFile('node', ['test/executable.js'])
                .then(result => {
                    expect(result).toEqual({
                        stdout: 'Executable started\n',
                        stderr: 'Executable stderr\n'
                    });
                }, err => fail(err))
                .finally(done);
        });
    });
});