const { exec } = require('child_process'); // eslint-disable-line
const { chdir } = require('node:process'); // eslint-disable-line
import axios from 'axios';

const issuer_url = "http://localhost:8082";
const wallet_url = "http://localhost:8081";
const verifier_url = "http://localhost:8083";

describe('Test integration', () => {
    beforeAll(() => {
        chdir('issuer');
        exec('docker-compose up -d --force-recreate --build');
        chdir('..');
        chdir('service_provider');
        exec('docker-compose up -d --force-recreate --build');
        chdir('..');
        chdir('identity_holder');
        exec('docker-compose up -d --force-recreate --build');
        chdir('..');
        return new Promise(r => setTimeout(r, 15000)); // 15 seconds allowed for all agents to start
    }, 16000);
    
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
        try {
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
        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Successful flow with user not known to issuer', async () => {
        try {
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
        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Successful flow with changes to name and format', async () => {
        try {
            let res;
            res = await axios.post(wallet_url + "/v2/auth/register", {
                    email: "bob2@test.com",
                    password: "hunter2"
            });
            const token = res.data.token;

            expect(token).toBeDefined();
            expect(res.status).toStrictEqual(200);

            // change name of issuer
            res = await axios.post(issuer_url + "/v2/name", {
                name: "QLDGovernment"
            });

            expect(res.status).toStrictEqual(200);

            // change format of issuer
            res = await axios.post(issuer_url + "/v2/format", {
                type: "PhotoCardCredential",
                attributes: ["firstName", "lastName", "dob"]
            });

            expect(res.status).toStrictEqual(200);
            
            // need to register with issuer now
            res = await axios.post(issuer_url + "/v2/register", {
                email: "bob2@test.com",
                password: "hunter2"
            });

            expect(res.status).toStrictEqual(200);

            // also need to provide information to issuer
            res = await axios.post(issuer_url + "/v2/info", {
                email: "bob2@test.com",
                info: {
                    firstName: "Bob",
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
                client_id: "bob2@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "PhotoCardCredential"
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
                    type: "PhotoCardCredential"
            },{
                headers: {
                Authorization: `Bearer ${token}`
            }});
        
            expect(res.status).toStrictEqual(200);
        
            // should receive credential ID
            const cred_id = res.data.credential_id

            expect(cred_id).toBeDefined();

            
            // inspect credential received

            const headers = {
                Authorization: `Bearer ${token}`
            };

            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });

            expect(res.status).toStrictEqual(200);
            const cred_r = res.data;
            const cred = cred_r.credential;
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("PhotoCardCredential");
            expect(cred.firstName).toStrictEqual("Bob");
            expect(cred.lastName).toStrictEqual("Wild");
            expect(cred.dob).toStrictEqual("11/09/2001");
        
            // update definition for verifier
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "PhotoCardCredential",
                requiredAttributes: ["firstName", "dob"] // omit lastname for privacyß
            });

            expect(res.status).toStrictEqual(200);

            // get presentation metadata
            res = await axios.get(wallet_url + `/v2/present?verifier_uri=${"http://host.docker.internal:8083"}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const type = res.data.type;
            const attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("PhotoCardCredential");
            expect(attrs).toStrictEqual(["firstName", "dob"]);
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
        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Successful flow with multiple users and multiple formats', async () => {
        try {
            let res;
            res = await axios.post(wallet_url + "/v2/auth/register", {
                    email: "bob3@test.com",
                    password: "hunter2"
            });
            let token = res.data.token;

            expect(token).toBeDefined();
            expect(res.status).toStrictEqual(200);

            // change name of issuer
            res = await axios.post(issuer_url + "/v2/name", {
                name: "QLDGovernment"
            });

            expect(res.status).toStrictEqual(200);

            // change format of issuer
            res = await axios.post(issuer_url + "/v2/format", {
                type: "PhotoCardCredential",
                attributes: ["firstName", "lastName", "dob"]
            });

            expect(res.status).toStrictEqual(200);
            
            // need to register with issuer now
            res = await axios.post(issuer_url + "/v2/register", {
                email: "bob3@test.com",
                password: "hunter2"
            });

            expect(res.status).toStrictEqual(200);

            // also need to provide information to issuer
            res = await axios.post(issuer_url + "/v2/info", {
                email: "bob3@test.com",
                info: {
                    firstName: "Bob",
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
                client_id: "bob3@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "PhotoCardCredential"
            });
        
            let auth_code = res.data.code;
            let state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toBeDefined();
            expect(state).toStrictEqual("xyz");
            expect(res.status).toStrictEqual(200);
        
            // retrieve issuer DID
            res = await axios.get(issuer_url);
        
            let issuer_did = res.data.did_uri;

            expect(issuer_did).toBeDefined();
            expect(res.status).toStrictEqual(200);

            // ask to have credential issued
            res = await axios.post(wallet_url + "/v2/issue", {
                    issuer_id: issuer_did,
                    auth_code: auth_code,
                    redirect_uri: wallet_url,
                    type: "PhotoCardCredential"
            },{
                headers: {
                Authorization: `Bearer ${token}`
            }});
        
            expect(res.status).toStrictEqual(200);
        
            // should receive credential ID
            let cred_id = res.data.credential_id

            expect(cred_id).toBeDefined();

            
            // inspect credential received

            let headers = {
                Authorization: `Bearer ${token}`
            };

            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });

            expect(res.status).toStrictEqual(200);
            let cred_r = res.data;
            let cred = cred_r.credential;
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("PhotoCardCredential");
            expect(cred.firstName).toStrictEqual("Bob");
            expect(cred.lastName).toStrictEqual("Wild");
            expect(cred.dob).toStrictEqual("11/09/2001");
        
            // update definition for verifier
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "PhotoCardCredential",
                requiredAttributes: ["firstName", "dob"] // omit lastname for privacyß
            });

            expect(res.status).toStrictEqual(200);

            // get presentation metadata
            res = await axios.get(wallet_url + `/v2/present?verifier_uri=${"http://host.docker.internal:8083"}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        
            let type = res.data.type;
            let attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("PhotoCardCredential");
            expect(attrs).toStrictEqual(["firstName", "dob"]);
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

            // register bob4 with wallet
            res = await axios.post(wallet_url + "/v2/auth/register", {
                email: "bob4@test.com",
                password: "hunter2"
            });
            token = res.data.token;

            expect(token).toBeDefined();
            expect(res.status).toStrictEqual(200);

            // register bob4 with issuer
            res = await axios.post(`${issuer_url}/v2/register`, {
                email: "bob4@test.com",
                password: "hunter2"
            });
            expect(res.status).toStrictEqual(200);

            // add info for bob4 to issuer
            res = await axios.post(`${issuer_url}/v2/info`, {
                email: "bob4@test.com",
                info: {
                    firstName: "Harold",
                    lastName: "Jenkinson",
                    licenseNo: "39",
                    expiryDate: "20/12/2026",
                    dob: "01/01/9000 BC" // Harold/bob4 is very old
                }
            });
            expect(res.status).toStrictEqual(200);

            // get auth code for bob4
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "bob4@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "PhotoCardCredential"
            });

            expect(res.status).toStrictEqual(200);

            auth_code = res.data.code;
            state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // issuer_id should not need to be updated

            // get issued credential for bob4
            // ask to have credential issued
            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "PhotoCardCredential"
            },{
                headers: {
                Authorization: `Bearer ${token}`
            }});

            expect(res.status).toStrictEqual(200);

            // should receive credential ID
            cred_id = res.data.credential_id

            expect(cred_id).toBeDefined();

            // make sure credential is formatted correctly: retrieve credential
            headers = {
                Authorization: `Bearer ${token}`
            };

            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });

            expect(res.status).toStrictEqual(200);
            cred_r = res.data;
            cred = cred_r.credential;
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("PhotoCardCredential");
            expect(cred.firstName).toStrictEqual("Harold");
            expect(cred.lastName).toStrictEqual("Jenkinson");
            expect(cred.dob).toStrictEqual("01/01/9000 BC");

            // get presentation metadata
            res = await axios.get(`${wallet_url}/v2/present?verifier_uri=http://host.docker.internal:8083`, { headers });

            type = res.data.type;
            attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("PhotoCardCredential");
            expect(attrs).toStrictEqual(["firstName", "dob"]);
            expect(res.status).toStrictEqual(200);

            // expect we are still trusted (issuer remains unchanged)

            // present bob4 credential
            res = await axios.post(wallet_url + "/v2/present", {
                verifier_uri: "http://host.docker.internal:8083",
                credential_id: cred_id
            }, { headers });

            expect(res.status).toStrictEqual(200);

            // change format of issuer
            res = await axios.post(`${issuer_url}/v2/format`, {
                type: "RSACard",
                attributes: ["firstName", "lastName"]
            })

            expect(res.status).toStrictEqual(200);

            // retrieve new DID
            res = await axios.get(issuer_url);
        
            expect(res.status).toStrictEqual(200);

            issuer_did = res.data.did_uri;

            // get new auth code
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "bob4@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            });

            expect(res.status).toStrictEqual(200);

            auth_code = res.data.code;
            state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // get issued new credential for bob4
            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "RSACard"
            },{ headers });

            expect(res.status).toStrictEqual(200);

            // should receive credential ID
            cred_id = res.data.credential_id

            expect(cred_id).toBeDefined();

            // make sure credential is formatted correctly: retrieve credential

            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });

            expect(res.status).toStrictEqual(200);
            cred_r = res.data;
            cred = cred_r.credential;
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("RSACard");
            expect(cred.firstName).toStrictEqual("Harold");
            expect(cred.lastName).toStrictEqual("Jenkinson");

            // update verifier definition to require rsa card
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "RSACard",
                requiredAttributes: ["firstName", "lastName"]
            });

            expect(res.status).toStrictEqual(200);

            // ask verifier to trust new DID
            res = await axios.post(`${verifier_url}/v2/trust`, {
                id: issuer_did
            });

            expect(res.status).toStrictEqual(200);

            // get presentation metadata
            res = await axios.get(`${wallet_url}/v2/present?verifier_uri=http://host.docker.internal:8083`, { headers });

            type = res.data.type;
            attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("RSACard");
            expect(attrs).toStrictEqual(["firstName", "lastName"]);
            expect(res.status).toStrictEqual(200);

            // present bob4 new credential
            res = await axios.post(wallet_url + "/v2/present", {
                verifier_uri: "http://host.docker.internal:8083",
                credential_id: cred_id
            }, { headers });

            expect(res.status).toStrictEqual(200);

            // change name of issuer
            res = await axios.post(`${issuer_url}/v2/name`, {
                name: "SAGovernment"
            });

            expect(res.status).toStrictEqual(200);

            // update DID
            res = await axios.get(issuer_url);
        
            expect(res.status).toStrictEqual(200);

            issuer_did = res.data.did_uri;

            // register bob5
            res = await axios.post(`${wallet_url}/v2/auth/register`, {
                email: "bob5@test.com",
                password: "hunter2"
            });

            expect(res.status).toStrictEqual(200);
            token = res.data.token;
            expect(token).toBeDefined();
            headers = {
                Authorization: `Bearer ${token}`
            };

            // log out bob5
            res = await axios.post(`${wallet_url}/v2/auth/logout`, {}, { headers });
            expect(res.status).toStrictEqual(200);

            // log in as bob5
            res = await axios.post(`${wallet_url}/v2/auth/login`, {
                email: "bob5@test.com",
                password: "hunter2"
            });

            expect(res.status).toStrictEqual(200);
            token = res.data.token;
            expect(token).toBeDefined();
            headers = {
                Authorization: `Bearer ${token}`
            };

            // register to issuer bob5
            res = await axios.post(`${issuer_url}/v2/register`, {
                email: "bob5@test.com",
                password: "hunter2"
            });
            expect(res.status).toStrictEqual(200);

            // add info to issuer for bob5
            res = await axios.post(`${issuer_url}/v2/info`, {
                email: "bob5@test.com",
                info: {
                    firstName: "Bob",
                    lastName: "Five"
                }
            });
            expect(res.status).toStrictEqual(200);

            // get auth code
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "bob5@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            });

            expect(res.status).toStrictEqual(200);

            auth_code = res.data.code;
            state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // get issued credential
            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "RSACard"
            },{ headers });

            expect(res.status).toStrictEqual(200);

            // should receive credential ID
            cred_id = res.data.credential_id

            expect(cred_id).toBeDefined();

            // make sure credential is formatted correctly: retrieve credential

            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });

            expect(res.status).toStrictEqual(200);
            cred_r = res.data;
            cred = cred_r.credential;
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("RSACard");
            expect(cred.firstName).toStrictEqual("Bob");
            expect(cred.lastName).toStrictEqual("Five");

            // get new did
            res = await axios.get(`${issuer_url}`);
            expect(res.status).toStrictEqual(200);
            issuer_did = res.data.did_uri;

            // trust new did
            res = await axios.post(`${verifier_url}/v2/trust`, {
                id: issuer_did
            });
            expect(res.status).toStrictEqual(200);

            // get presentation metadata
            res = await axios.get(`${wallet_url}/v2/present?verifier_uri=http://host.docker.internal:8083`, { headers });

            type = res.data.type;
            attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("RSACard");
            expect(attrs).toStrictEqual(["firstName", "lastName"]);
            expect(res.status).toStrictEqual(200);

            // make presentation
            res = await axios.post(wallet_url + "/v2/present", {
                verifier_uri: "http://host.docker.internal:8083",
                credential_id: cred_id
            }, { headers });

            expect(res.status).toStrictEqual(200);
        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Failed flow: user not registered with issuer', async () => {
        try {
            // from previous tests, the issuer issues RSACard
            // register buddy
            const res = await axios.post(`${wallet_url}/v2/auth/register`, {
                email: 'buddy@test.com',
                password: 'hunter2'
            });

            expect(res.status).toStrictEqual(200);

            // attempt to get auth code: should fail, since issuer does not know us
            await expect(axios.post(issuer_url + "/v2/authorize", {
                client_id: "buddy@test.com",
                client_secret: "wahoo",
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            })).rejects.toBeDefined();

        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
        
    });

    test('Failed flow: user info known to issuer doesnt satisfy format', async () => {
        try {
            // from previous tests, the issuer issues RSACard
            // register friend
            let res = await axios.post(`${wallet_url}/v2/auth/register`, {
                email: 'friend@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);
            const token = res.data.token;
            expect(token).toBeDefined();

            const headers = {
                Authorization: `Bearer ${token}`
            };

            // register with issuer as well
            res = await axios.post(`${issuer_url}/v2/register`, {
                email: 'friend@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);

            // attempt to get auth code: this should succeed, they know who this is
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "friend@test.com",
                client_secret: "wahoo",
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            });

            expect(res.status).toStrictEqual(200);

            const auth_code = res.data.code;
            const state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // get DID as well, need it for this
            res = await axios.get(issuer_url);
        
            expect(res.status).toStrictEqual(200);

            const issuer_did = res.data.did_uri;

            // now, attempt to issue a credential should fail
            await expect(axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "RSACard"
            },{ headers })).rejects.toBeDefined();

        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Failed flow: verifier presented with wrong format', async () => {
        try {
            // from previous tests, the issuer issues RSACard
            // register friend
            let res = await axios.post(`${wallet_url}/v2/auth/register`, {
                email: 'rasin@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);
            const token = res.data.token;
            expect(token).toBeDefined();

            const headers = {
                Authorization: `Bearer ${token}`
            };

            // register with issuer as well
            res = await axios.post(`${issuer_url}/v2/register`, {
                email: 'rasin@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);

            // and add info
            res = await axios.post(`${issuer_url}/v2/info`, {
                email: 'rasin@test.com',
                info: {
                    firstName: 'raisin',
                    lastName: 'hell'
                }
            });
            expect(res.status).toStrictEqual(200);

            // attempt to get auth code: this should succeed, they know who this is
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "rasin@test.com",
                client_secret: "wahoo",
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            });

            expect(res.status).toStrictEqual(200);

            const auth_code = res.data.code;
            const state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // get DID as well, need it for this
            res = await axios.get(issuer_url);
        
            expect(res.status).toStrictEqual(200);

            const issuer_did = res.data.did_uri;

            // issue cred
            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "RSACard"
            },{ headers });

            expect(res.status).toStrictEqual(200);

            // configure verifer to expect a driver licence instead
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "DriverLicence",
                requiredAttributes: ["firstName", "lastName"]
            });

            // request for presentation definition should fail since user can't present correct credential
            await expect(axios.get(`${wallet_url}/v2/present?verifier_uri=http://host.docker.internal:8083`, { headers })).rejects.toBeDefined();

        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Failed flow: verifier presented with wrong attributes', async () => {
        try {
            // from previous tests, the issuer issues RSACard
            // register friend
            let res = await axios.post(`${wallet_url}/v2/auth/register`, {
                email: 'fruit@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);
            const token = res.data.token;
            expect(token).toBeDefined();

            const headers = {
                Authorization: `Bearer ${token}`
            };

            // register with issuer as well
            res = await axios.post(`${issuer_url}/v2/register`, {
                email: 'fruit@test.com',
                password: 'hunter2'
            });
            expect(res.status).toStrictEqual(200);

            // and add info
            res = await axios.post(`${issuer_url}/v2/info`, {
                email: 'fruit@test.com',
                info: {
                    firstName: 'fruit',
                    lastName: 'salad'
                }
            });
            expect(res.status).toStrictEqual(200);

            // attempt to get auth code: this should succeed, they know who this is
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "fruit@test.com",
                client_secret: "wahoo",
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
            });

            expect(res.status).toStrictEqual(200);

            const auth_code = res.data.code;
            const state = res.data.state;

            expect(auth_code).toBeDefined();
            expect(state).toStrictEqual("xyz");

            // get DID as well, need it for this
            res = await axios.get(issuer_url);
        
            expect(res.status).toStrictEqual(200);

            const issuer_did = res.data.did_uri;

            // issue cred
            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: "RSACard"
            },{ headers });

            expect(res.status).toStrictEqual(200);

            // configure verifer to expect a RSACard, but also expects to see dob
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "RSACard",
                requiredAttributes: ["firstName", "lastName", "dob"]
            });

            // this should fail again, since we don't have an RSACard containing dob
            await expect(axios.get(`${wallet_url}/v2/present?verifier_uri=http://host.docker.internal:8083`, { headers })).rejects.toBeDefined();

        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });

    test('Failed flow: verifer presented with untrusted credential', async () => {
        try {
            // first change issuer name to ensure we don't have lingering trust
            let res;
            res = await axios.post(`${issuer_url}/v2/name`, {
                name: "DodgyNSWGov"
            });
            expect(res.status).toStrictEqual(200);

            // also change verifier back to regular RSA card
            res = await axios.post(`${verifier_url}/v2/definition`, {
                type: "RSACard",
                requiredAttributes: ["firstName", "lastName"]
            });
            expect(res.status).toStrictEqual(200);

            res = await axios.post(wallet_url + "/v2/auth/register", {
                    email: "john@test.com",
                    password: "hunter2"
            });
            const token = res.data.token;

            expect(token).toBeDefined();
            expect(res.status).toStrictEqual(200);
            
            // need to register with issuer now
            res = await axios.post(issuer_url + "/v2/register", {
                email: "john@test.com",
                password: "hunter2"
            });

            expect(res.status).toStrictEqual(200);

            // also need to provide information to issuer
            res = await axios.post(issuer_url + "/v2/info", {
                email: "john@test.com",
                info: {
                    firstName: "John",
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
                client_id: "john@test.com",
                client_secret: "wahoo", // this is unused
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "RSACard"
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
                    type: "RSACard"
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

            // expect presentation to fail for untrusted issuer
            await expect(axios.post(wallet_url + "/v2/present", {
                verifier_uri: "http://host.docker.internal:8083",
                credential_id: cred_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })).rejects.toBeDefined();

        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });
});