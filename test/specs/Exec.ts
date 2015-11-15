import { exec } from 'process-promises';

describe('exec', () => {
    describe('node test/executable.js', () => {
        it('should not fail', done => {
            exec('node test/executable.js')
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