const { spawn } = require('node:child_process'); // eslint-disable-line

describe('Integration tests', () => {
    beforeEach(async () => {
        // start agents
        // tests run from /services, so paths are relative accordingly
        await spawn('echo', ['hello', 'world'])
    });

    test('dummy', () => {
        
    });
});