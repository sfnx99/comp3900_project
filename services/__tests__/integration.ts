const { spawn } = require('node:child_process');

describe('Integration tests', () => {
    beforeEach(async () => {
        // start agents
        // tests run from /services, so paths are relative accordingly
        const test = await spawn('', ['hello', 'world'])
    });

    test('dummy', () => {
        
    });
});