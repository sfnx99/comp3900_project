import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FORMAT_MAP, getData, toUser } from './data';
import { SessionData } from './interface';
export function getIssuers(token: string) {
    const data = getData();
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }

    return {
        status: 200,
        body: {
            issuers: data.issuers
        }
    };
}

export async function getRequest(token: string, issuer: string) {
    const user = toUser(token);
    if (user === undefined) {
        return Promise.resolve({
            status: 401,
            body: {
                error: "Invalid session"
            }
        });
    }
    const issuerMetadata = issuer + "/v1/metadata";

    try {
        const res = await axios.get(issuerMetadata);
        return {
            status: 200,
            body: {
                formats: res.data.formats_supported
            }
        };
    } catch (err) {
        return {
            status: 500,
            body: {
                error: err
            }
        };
    }
}

export async function makeRequest(token: string, issuer: string, format: string, access_token: string) {
    const user = toUser(token);
    if (user === undefined) {
        return Promise.resolve({
            status: 401,
            body: {
                error: "Invalid session"
            }
        });
    }
    if (!(format in FORMAT_MAP)) {
        return Promise.resolve({
            status: 400,
            body: {
                error: "Unsupported format"
            }
        });
    }
    // Request to be issued in that format
    const issuerRequest = issuer + "/v1/credential/issue";
    const headers = {Authorization: `Bearer ${access_token}`};
    const body = {format: format};
    try {
        const res = await axios.post(issuerRequest, body, {headers});
        // We got the credential, add it to database
        user.credentials.push({
            iss: issuer,
            id: uuidv4(),
            cred: res.data
        });
        return {
            status: 200,
            body: {}
        }
    } catch (err) {
        return {
            status: 500,
            body: {
                error: err
            }
        };
    }
}

// V2
export function getIssuersV2(session_data: SessionData) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const data = getData();
    return {
        status: 200,
        body: {
            issuers: data.issuers
        }
    };
}

export function getRequestV2(session_data: SessionData, issuer_id: string) {
    // We should resolve the DID here, pending on the upcoming meeting
    // TODO: above
    console.log(`resolve ${issuer_id} for ${session_data.user.email}`);
    const dummy_response = {
        types: ["CredentialType1", "CredentialType2"],
        oauth_servers: ["http://localhost:8082"],
    };
    return {
        status: 200,
        body: dummy_response
    };
}

export async function makeRequestV2(session_data: SessionData, issuer_id: string, auth_code: string, type: string, redirect_uri: string) {
    // Resolve DID TODO
    const dummy_response = {
        types: ["CredentialType1", "CredentialType2"],
        oauth_servers: ["http://localhost:8082"],
        dummy: issuer_id
    };

    // Get an access token
    const token_body = {
        grant_type: "authorization_code",
        code: auth_code,
        redirect_uri: redirect_uri,
        client_id: session_data.user.email
    }

    try {
        const resp = await axios.post(dummy_response.oauth_servers[0] + "/v2/token", token_body);
        const access_token = resp.data.access_token;
        if (access_token === undefined) {
            throw Error("Couldn't parse access token");
        }

        // Use access token to request credential
        const cred_headers = {
            Authorization: `Bearer ${access_token}`
        }
        const cred_body = {
            format: "ldp_vc"
        }

        const c_resp = await axios.post(dummy_response.oauth_servers[0] + "/v2/credential", cred_body, {headers: cred_headers});
        const cred = c_resp.data.credential;
        if (cred === undefined) {
            throw Error("Couldn't parse credential");
        }

        // Save credential to user (maybe add some error checking?)
        session_data.user.credentialsV2.push(cred);

        // Return ID
        return {
            status: 200,
            body: {
                credential_id: cred.id
            }
        };

    } catch(err) {
        return {
            status: 500,
            body: { err }
        }
    }
}