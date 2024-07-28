const { exec } = require('child_process'); // eslint-disable-line
const { chdir } = require('node:process'); // eslint-disable-line
import axios from 'axios';

const issuer_url = "http://localhost:8082";
const wallet_url = "http://localhost:8081";
const verifier_url = "http://localhost:8083";

describe('Test integration', () => {
    beforeAll(() => {
        chdir('issuer');
        exec('docker-compose up -d');
        chdir('..');
        chdir('service_provider');
        exec('docker-compose up -d');
        chdir('..');
        chdir('identity_holder');
        exec('docker-compose up -d');
        chdir('..');
        return new Promise(r => setTimeout(r, 5000)); // 5 seconds allowed for all agents to start
    }, 6000);
    
    afterAll(() => {
        chdir('issuer');
        exec('docker-compose down');
        chdir('..');
        chdir('service_provider');
        exec('docker-compose down');
        chdir('..');
        chdir('identity_holder');
        exec('docker-compose down');
        return new Promise(r => setTimeout(r, 15000)); // 15 seconds allowed for all agents to end
    }, 16000);

    test('Successful flow with user known to issuer', async () => {
        let res;
        res = await axios.post(wallet_url + "/v2/auth/register", {
                email: "bob@test.com",
                password: "hunter2"
        });
        const token = res.data.token;

        expect(token).toBeDefined();
        expect(res.status).toStrictEqual(200);
        
        // retrieve auth code
        // need to simulate clicking the submit button - we can do this by manually submitting post to verifer
        res = await axios.post(issuer_url + "/v2/authorize", {
            client_id: "bob@test.com",
            client_secret: "wahoo",
            redirect_uri: wallet_url,
            state: "xyz",
            scope: "DriverLicenceCredential"
        });
    
        const auth_code = res.data.code;
        const state = res.data.state;

        expect(auth_code).toBeDefined();
        expect(state).toBeDefined();
        expect(state).toStrictEqual("xyz");
        expect(res.status).toStrictEqual(200);

        // retrieve issuer DID
        res = await axios.get(issuer_url);
    
        const issuer_did = res.data.did_uri;

        expect(issuer_did).toBeDefined();
        expect(res.status).toStrictEqual(200);

        // ask to have credential issued
        res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "DriverLicenceCredential"
        },{
            headers: {
            Authorization: `Bearer ${token}`
        }});
    
        expect(res.status).toStrictEqual(200);
    
        // should receive credential ID
        const cred_id = res.data.credential_id

        expect(cred_id).toBeDefined();
    
        // get presentation metadata
        res = await axios.get(wallet_url + `/v2/present?verifier_uri=${"http://host.docker.internal:8083"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        const type = res.data.type;
        const attrs = res.data.requiredAttributes;
        expect(type).toBeDefined();
        expect(attrs).toBeDefined();
        expect(res.status).toStrictEqual(200);

        // make verifier trust this issuer
        res = await axios.post(verifier_url + "/v2/trust", {
            "id": issuer_did
        });

        expect(res.status).toStrictEqual(200);
    
        // perform presentation
        res = await axios.post(wallet_url + "/v2/present", {
            verifier_uri: "http://host.docker.internal:8083",
            credential_id: cred_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(res.status).toStrictEqual(200);
    });

    test('Successful flow with user not known to issuer', async () => {
        let res;
        res = await axios.post(wallet_url + "/v2/auth/register", {
                email: "harry@test.com",
                password: "hunter2"
        });
        const token = res.data.token;

        expect(token).toBeDefined();
        expect(res.status).toStrictEqual(200);
        
        // need to register with issuer now
        res = await axios.post(issuer_url + "/v2/register", {
            email: "harry@test.com",
            password: "hunter2"
        });

        expect(res.status).toStrictEqual(200);

        // also need to provide information to issuer
        res = await axios.post(issuer_url + "/v2/info", {
            email: "harry@test.com",
            info: {
                firstName: "Harry",
                lastName: "Wild",
                licenseNo: "287",
                expiryDate: "20/12/2026",
                dob: "11/09/2001"
            }
        });

        expect(res.status).toStrictEqual(200);

        // now we can retrieve auth code
        // need to simulate clicking the submit button - we can do this by manually submitting post to verifer
        res = await axios.post(issuer_url + "/v2/authorize", {
            client_id: "harry@test.com",
            client_secret: "wahoo", // this is unused
            redirect_uri: wallet_url,
            state: "xyz",
            scope: "DriverLicenceCredential"
        });
    
        const auth_code = res.data.code;
        const state = res.data.state;

        expect(auth_code).toBeDefined();
        expect(state).toBeDefined();
        expect(state).toStrictEqual("xyz");
        expect(res.status).toStrictEqual(200);
    
        // retrieve issuer DID
        res = await axios.get(issuer_url);
    
        const issuer_did = res.data.did_uri;

        expect(issuer_did).toBeDefined();
        expect(res.status).toStrictEqual(200);

        // ask to have credential issued
        res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "DriverLicenceCredential"
        },{
            headers: {
            Authorization: `Bearer ${token}`
        }});
    
        expect(res.status).toStrictEqual(200);
    
        // should receive credential ID
        const cred_id = res.data.credential_id

        expect(cred_id).toBeDefined();
    
        // get presentation metadata
        res = await axios.get(wallet_url + `/v2/present?verifier_uri=${"http://host.docker.internal:8083"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        const type = res.data.type;
        const attrs = res.data.requiredAttributes;
        expect(type).toBeDefined();
        expect(attrs).toBeDefined();
        expect(res.status).toStrictEqual(200);

        // make verifier trust this issuer
        res = await axios.post(verifier_url + "/v2/trust", {
            "id": issuer_did
        });

        expect(res.status).toStrictEqual(200);
    
        // perform presentation
        res = await axios.post(wallet_url + "/v2/present", {
            verifier_uri: "http://host.docker.internal:8083",
            credential_id: cred_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(res.status).toStrictEqual(200);
    });
});