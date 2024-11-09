const { exec } = require('child_process'); // eslint-disable-line
const { chdir } = require('node:process'); // eslint-disable-line
import axios from 'axios';

const issuer_url = "http://localhost:8082";
const wallet_url = "http://localhost:8081";
const verifier_url = "http://localhost:8083";

describe('Test integration for UNSW use cases', () => {
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
    
    test('Issuance and Verification of a simple UNSW style ID', async () => {
        try {
            /////////////////////////////////////////////////////////
            // These routes must be called on initalisation of issuer servers. No frontend needed here
            // Format Issuer to be UNSW
            // change name to be UNSW
            let res = await axios.post(issuer_url + "/v2/name", {
                name: "UNSW"
            });
            expect(res.status).toStrictEqual(200);
            // change format to be a UNSW Credential
            res = await axios.post(issuer_url + "/v2/format", {
                type: "UNSWCredential",
                attributes: ["firstName", "lastName", "zID", "dob", "USI", "faculty", "expiryDate", "program", "COMP3900Grade"]
            });
            expect(res.status).toStrictEqual(200);

            /////////////////////////////////////////////////////////
            // Identity holder must now register in the wallet application & Issuer
            // Wallet Registration: This route should be called through front end of wallet app
            res = await axios.post(wallet_url + "/v2/auth/register", {
                email: "bob@test.com",
                password: "hunter2"
            });
            expect(res.status).toStrictEqual(200);
            // This token must be held onto on wallet side for use later on
            const token = res.data.token;
            console.log(token);
            // Issuer Registration: User will register with the issuer
            // Not sure on the point of this but it is a requirement for bookworms to work
            res = await axios.post(issuer_url + "/v2/authorize", {
                client_id: "bob@test.com",
                client_secret: "wahoo", // Not sure what purpose of this is client_secret is here
                redirect_uri: wallet_url,
                state: "xyz",
                scope: "UNSWCredential"
            });
            // These must be held onto by the issuer for next step of issuance
            const auth_code = res.data.code;
            const state = res.data.state;
            // User will also provide information to issuer (Both of these steps are probably best combined together on frontend)
            res = await axios.post(issuer_url + "/v2/info", {
                email: "bob@test.com",
                info: {
                    firstName: "Bob",
                    lastName: "Wild",
                    dob: "16/05/1888",
                    USI: "98724159859",
                    faculty: "COMPSCI",
                    expiryDate: "16/09/2010",
                    program: "Whatever the cool program is",
                    COMP3900Grade: "100",
                    zID: "z111111"
                }
            });

            /////////////////////////////////////////////////////////
            // Credential Issuance is handled like so

            // SCANNING OF FIRST QR CODE BY WALLET
            // Issuer will create a QR code with the following attributes as a JSON object
                // DID of issuer
            res = await axios.get(issuer_url);
            const issuer_did = res.data.did_uri;
                // Authentication Code (Generated above)
                // Licence Type
            const licenseType = "UNSWCredential";
            
            // Wallet app can scan and convert these to variables to now use
            // Ask to have credential issued (called by wallet after QR scan)
            
            res = await axios.get(wallet_url + '/hello');

            res = await axios.post(wallet_url + "/v2/issue", {
                issuer_id: issuer_did,
                auth_code: auth_code,
                redirect_uri: wallet_url,
                type: licenseType
            },{
                headers: {
                Authorization: `Bearer ${token}`
            }});

            // We also get a credential ID returned here (not necessary need all the time)
            // Can use this to get details of credential through
            let cred_id = res.data.credential_id
            let headers = {
                Authorization: `Bearer ${token}`
            };
            res = await axios.get(`${wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });
            let cred_r = res.data;
            let cred = cred_r.credential; // This block of code is useless unless you want to inspect the fields (need for displaying on wallet app)
            expect(cred_r.issuer).toStrictEqual(issuer_did);
            expect(cred_r.type).toContain("UNSWCredential");
            expect(cred.firstName).toStrictEqual("Bob");
            expect(cred.lastName).toStrictEqual("Wild");
            expect(cred.dob).toStrictEqual("16/05/1888");

            /////////////////////////////////////////////////////////
            // Verifier now needs to define what fields it actually cares about (selective disclousure)
            // Call these route on initialisation of front end
            res = await axios.post(verifier_url + '/v2/definition', {
                type: licenseType,
                requiredAttributes: ["zID", "expiryDate"]
            });
            expect(res.status).toStrictEqual(200);

            // Also needs to 'trust' the issuer
            res = await axios.post(verifier_url + "/v2/trust", {
                "id": issuer_did
            });

            /////////////////////////////////////////////////////////
            // Verification process!!!

            // QRCode Number 2!
            // All this QR needs to contain is a JSON object like so
            /*
            {
                verifier_uri: verifier_uri
            }
            */
           const verifier_uri = "http://host.docker.internal:8083"; // Note this one is differnet to just local host it has the docker line

        // Now we request what the verifier actually wants
        res = await axios.get(wallet_url + `/v2/present?verifier_uri=${verifier_uri}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            let type = res.data.type;
            let attrs = res.data.requiredAttributes;
            expect(type).toStrictEqual("UNSWCredential");
            expect(attrs).toStrictEqual(["zID", "expiryDate"]);
            expect(res.status).toStrictEqual(200);

            // This should then prompt the user on the wallet application (do you want to share these details)
            // If they do call this request
            res = await axios.post(wallet_url + "/v2/present", {
                verifier_uri: verifier_uri,
                credential_id: cred_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Right now this is just a bool? Not sure how the verifier captures the data
            expect(res.status).toStrictEqual(200);
        } catch(err) {
            if (err instanceof axios.AxiosError) {
                throw new Error(`Failed to make request: ${JSON.stringify(err)}`);
            } else {
                throw err;
            }
        }
    });
});