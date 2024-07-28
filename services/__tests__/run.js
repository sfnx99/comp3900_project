const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { chdir } = require('node:process');
const axios = require('axios');

const issuer_url = "http://localhost:8082";
const wallet_url = "http://localhost:8081";
const verifier_url = "http://localhost:8083";

const main = async () => {
    // register user with wallet
    let res;
    res = await axios.post(wallet_url + "/v2/auth/register", {
            email: "bob@test.com",
            password: "hunter2"
    });
    const token = res.data.token;

    console.log(`Recieved token: ${token}`);

    // retrieve auth code
    // need to simulate clicking the submit button - we can do this by manually submitting post to verifer
    res = await axios.post(issuer_url + "/v2/authorize", {
        client_id: "bob@test.com",
        client_secret: "wahoo",
        redirect_uri: wallet_url,
        state: "xyz",
        scope: "DriverLicenceCredential"
    });

    const auth_code = res.data.code

    console.log(`Authorization code: ${auth_code}`);

    // retrieve issuer DID (TODO)
    const issuer_did = "did:ion:EiB318P47djLGHeq1a_02YuStsllrWB1STXYwmBVJlQe3Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJhRmp4U2FmWjlSbHBraFJfQTNONGFhX3ZPdFdETVM0b0dJdlpoeG1YVzljIiwieSI6Ii16TTdUbWxWLVdyeTA1Y2hoVmo5ZDY5dnVaeWh6OTVLMHJfMjdBNl9lQjQifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoidmMtZGF0YSIsInNlcnZpY2VFbmRwb2ludCI6eyJjcmVkZW50aWFsX2NvbmZpZ3VyYXRpb25zX3N1cHBvcnRlZCI6eyJEcml2ZXJMaWNlbmNlQ3JlZGVudGlhbCI6eyJmb3JtYXQiOiJsZHBfdmMifX0sImNyZWRlbnRpYWxfZW5kcG9pbnQiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6ODA4MiIsImtleSI6IlsxNjAsMjQxLDIyNiw5MSwyNDIsMTgxLDIyMSw2NCwxNzIsMTIzLDE5NSwyMTgsMjA5LDE5Miw4LDE4NywxNDgsMTEzLDIxMiwyNTUsMjA5LDY5LDE3Nyw5OSwyLDE3MywxMjksMTk2LDE3MCw0Niw1MiwzOCw1LDIyNywxNzIsMTI4LDEyOSwyNTQsNjMsMTg4LDE2MCwxNjEsMTUxLDE1NiwxMzgsMTU1LDQxLDE0Miw5LDEzMCwxNDcsMjUzLDE0MCw2MCwxNDAsMjI0LDE4MywzMiwxODYsMTc4LDI1LDE4OSwyNSwxNTgsMjIsMjQyLDYsNzgsMTI4LDIyMywyMjksMTA2LDE0Nyw5NywzOSwxODUsMTY1LDIyNywyNSwxMDAsMTYyLDExLDY4LDYzLDYxLDU3LDE3MCw3NCwxNTIsOSwzNiw0Nyw1NCwxMTIsMTczLDQyXSIsIm5hbWUiOiJOU1dHb3Zlcm5tZW50In0sInR5cGUiOiJ2Yy1kYXRhIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCNWpodmdmaWtEWFdQZ01OLWpjbmpKZGRqZVJYYkNnSHV6NXF4N21UXzBCQSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQThYY2NST0pKd2o3RTNtTUl3ckdkRUZlLUJIdTF2T3NXNXplMnZWQXBybHciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUFGTDQxVEdVcnRfRDlkT2hpdWdqMFVMSXRmMDFseWg1UGxyTmtRLXhNVGVBIn19";


    // ask to have credential issued
    res = await axios.post(wallet_url + "/v2/issue", {
            issuer_id: issuer_did,
            auth_code: auth_code,
            redirect_uri: wallet_url,
            type: "DriverLicenceCredential"
    },{
        headers: {
        Authorization: `Bearer ${token}`
    }},);


    // should receive credential ID
    const cred_id = res.data.credential_id

    console.log(cred_id);
}

main();