import axios from 'axios';
import config from '../config.json';

// Function to issue and verify credentials
export const issueAndVerifyCredential = async () => {
    try {
        /////////////////////////////////////////////////////////
        // These routes must be called on initalisation of issuer servers. No frontend needed here
        // Format Issuer to be UNSW
        // change name to be UNSW
        let res = await axios.post(config.issuer_url + "/v2/name", {
            name: "UNSW"
        });
        // change format to be a UNSW Credential
        res = await axios.post(config.issuer_url + "/v2/format", {
            type: "UNSWCredential",
            attributes: ["firstName", "lastName", "zID", "dob", "USI", "faculty", "expiryDate", "program", "COMP3900Grade"]
        });

        /////////////////////////////////////////////////////////
        // Identity holder must now register in the wallet application & Issuer
        // Wallet Registration: This route should be called through front end of wallet app
        res = await axios.post(config.wallet_url + "/v2/auth/register", {
            email: "bob29@test.com",
            password: "hunter2"
        });
        // This token must be held onto on wallet side for use later on
        const token = res.data.token;
        // Issuer Registration: User will register with the issuer
        // Not sure on the point of this but it is a requirement for bookworms to work
        res = await axios.post(config.issuer_url + "/v2/authorize", {
            application: {
                client_id: "bob@test.com",
                credentialType: "UNSWCredential"
            },
            client_id: "bob@test.com",
            client_secret: "wahoo", // Not sure what purpose of this is client_secret is here
            redirect_uri: config.wallet_url,
            state: "xyz",
            scope: "UNSWCredential"
        });

        // These must be held onto by the issuer for next step of issuance
        const auth_code = res.data.code;
        const state = res.data.state;
        // User will also provide information to issuer (Both of these steps are probably best combined together on frontend)
        res = await axios.post(config.issuer_url + "/v2/info", {
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
        res = await axios.get(config.issuer_url);
        const issuer_did = res.data.did_uri;
            // Authentication Code (Generated above)
            // Licence Type
        const licenseType = "UNSWCredential";
        
        // Wallet app can scan and convert these to variables to now use
        // Ask to have credential issued (called by wallet after QR scan)

        res = await axios.post(config.wallet_url + "/v2/issue", {
            issuer_id: issuer_did,
            auth_code: auth_code,
            redirect_uri: config.wallet_url,
            type: licenseType
        },{
            headers: {
            Authorization: `Bearer ${token}`
        }});
    
        // We also get a credential ID returned here (not necessary need all the time)
        // Can use this to get details of credential through
        // "wallet_url + /v2/credentials" - gives list of credentials as an array
        const cred_id = res.data.credential_id
        const headers = {
            Authorization: `Bearer ${token}`
        };
        res = await axios.get(`${config.wallet_url}/v2/credential?credential_id=${cred_id}`, { headers });
        const cred_r = res.data;
        const cred = cred_r.credential; // This block of code is useless unless you want to inspect the fields (need for displaying on wallet app)

        return {'cred': cred, 'auth_code': auth_code, 'state': state, 'token': token, 'licenseType': licenseType, 'issuer_did': issuer_did}; // Return credential details for further processing if needed

    } catch (error) {
        console.error('Error during credential issuance and verification:', error);
        throw error;
    }
};
