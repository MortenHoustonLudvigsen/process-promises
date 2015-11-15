import { fork } from 'process-promises';

describe('fork', () => {
    describe('test/executable.js', () => {
        it('should not fail', done => {
            var output = { stdout: '', stderr: '' };

            fork('../executable.js')
                .progress(info => {
                    if (info.stdout) output.stdout += info.stdout + '\n';
                    if (info.stderr) output.stderr += info.stderr + '\n';
                })
                .then(result => {
                    expect(output).toEqual({
                        stdout: 'Executable started\n',
                        stderr: 'Executable stderr\n'
                    });
                }, err => fail(err))
                .finally(done);
        });
    });
});