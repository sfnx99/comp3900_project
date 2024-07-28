const { exec } = require('node:child_process'); // eslint-disable-line
const { chdir } = require('node:process'); // eslinte-disable-line
import axios from "axios";

let issuer_did = "";
const issuer_url = "http://localhost:8081";
const wallet_url = "http://localhost:8082";
const verifier_url = "http://localhost:8083";

describe('Integration tests', () => {
    beforeAll(async () => {
        // // start agents
        // chdir('issuer');
        // const iss = exec('docker-compose up');
        // // extract DID
        // iss.stdout.on('data', (data: string) => {
        //     if (data.includes('DID document')) {
        //         issuer_did = /did:ion:[\w:]+/.exec(data)![0]
        //         console.log(issuer_did);
        //     }
        // });
        // chdir('..');
        // chdir('service_provider');
        // exec('docker-compose up');
        // chdir('..');
        // chdir('identity_holder');
        // exec('docker-compose up');
        // chdir('..')
    });

    afterAll(() => {
        // chdir('issuer');
        // exec('docker-compose down');
        // chdir('..');
        // chdir('service_provider');
        // exec('docker-compose down');
        // chdir('..');
        // chdir('identity_holder');
        // exec('docker-compose down');
        // chdir('..')
    });

    test('Successful flow: hardcoded user (pre-registered to issuer)', async () => {
        // test still WIP

        // // register user with wallet
        // let res;
        // res = await axios.post(wallet_url + "/v2/auth/register", {
        //     body: {
        //         email: "bob@test.com",
        //         password: "hunter2"
        //     }
        // });
        // const token = res.data.token;

        // expect(token).toBeDefined();
        
        // // retrieve auth code
        // // need to simulate clicking the submit button - we can do this by manually submitting post to verifer
        // res = await axios.post(issuer_url + "/v2/authorize", {
        //     body: {
        //         client_id: "bob@test.com",
        //         client_secret: "wahoo",
        //         redirect_uri: wallet_url,
        //         state: "xyz",
        //         scope: "DriverLicenceCredential"
        //     }
        // });

        // const auth_code = res.data.code
        // expect(auth_code).toBeDefined();
        // expect(res.data.state).toBeDefined();
        // expect(res.data.state).toStrictEqual("xyz");

        // // ask to have credential issued
        // res = await axios.post(wallet_url + "/v2/issue", {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     },
        //     body: {
        //         issuer_id: issuer_did,
        //         auth_code: auth_code,
        //         redirect_uri: wallet_url,
        //         type: "DriverLicenceCredential"
        //     }
        // });

        // // should receive credential ID
        // const cred_id = res.data.credential_id

        // expect(cred_id).toBeDefined();

    });
});