import { getUser, getCredential } from './db.js';

const auth_codes: Map<string, {client_id: string, scope: string}> = new Map();
const tokens: Map<string, {client_id: string, scope: string}> = new Map();

export function authorize(client_id: string, client_secret: string, redirect_uri: string, state: string, scope: string): {code: string, state: string} {
    // check if we know this user
    getUser(client_id);
    // if we didn't throw an error, all is well
    const auth_code = (Math.random() + 1).toString(36).substring(2);
    auth_codes.set(auth_code, {client_id, scope});
    //return `${redirect_uri}?code=${auth_code}&state=${state}`;
    return {
        code: auth_code,
        state: state
    };
}

export function token(client_id: string, auth_code: string): string {
    const request = auth_codes.get(auth_code);
    if (request === undefined) {
        throw new Error("Bad Auth Code");
    }
    // see if we can issue this credential to the user
    getCredential(request.client_id, request.scope);
    const token = (Math.random() + 1).toString(36).substring(2);
    tokens.set(token, request);
    return token;
}

export function authenticate(access_token: string): {client_id: string, scope: string} {
    const request = tokens.get(access_token);
    if (request === undefined) {
        throw new Error("Bad access token");
    }
    return request;
}