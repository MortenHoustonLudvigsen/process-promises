import { exec } from 'process-promises';

describe('exec', () => {
    describe('dir', () => {
        it('should not fail', done => {
            exec('dir')
                .fail(err => fail(err))
                .finally(() => done());
        });
    });
});