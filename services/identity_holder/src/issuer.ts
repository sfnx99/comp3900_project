import { getData, toUser, FORMAT_MAP } from './data';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
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