const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { chdir } = require('node:process');
const main = async () => {
    chdir('issuer');
    await exec('docker-compose up -d');
    console.log('Started issuer')
    chdir('..');
    chdir('service_provider');
    await exec('docker-compose up -d');
    console.log('Started service provider')
    chdir('..');
    chdir('identity_holder');
    await exec('docker-compose up -d');
    console.log('Started identity holder')
}

main();