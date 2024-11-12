import { getUser, getCredential, getIssuerAdmin } from './db.js';

const auth_codes: Map<string, {client_id: string, scope: string}> = new Map();
const tokens: Map<string, {client_id: string, scope: string}> = new Map();
const adminTokens: Map<string, {admin_id: string}> = new Map(); // Store admin tokens

// User authorization functions
export function authorize(client_id: string, client_secret: string, redirect_uri: string, state: string, scope: string): {code: string, state: string} {
    // check if we know this user //assume we have already registered the user in issuer db
    console.log(`Checking known client id ${client_id}...`);
    getUser(client_id);
    console.log(`Success: client id is known`);
    // if we didn't throw an error, all is well
    console.log(`Generating auth code...`); //acts like public
    const auth_code = (Math.random() + 1).toString(36).substring(2);
    console.log(`Success: auth code generated to ${client_id} for ${scope}`);
    auth_codes.set(auth_code, {client_id, scope});
    
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

// IssuerAdmin authorization functions
export function authorizeIssuerAdmin(admin_id: string, admin_secret: string, did_url: string): string {
    // check if we know this admin
    console.log(`Checking known admin id ${admin_id}...`);
    const admin = getIssuerAdmin(admin_id);
    if (!admin || admin.info.admin_secret !== admin_secret) {
        throw new Error("Invalid admin credentials");
    }
    console.log(`Success: admin id is known`);
    adminTokens.set(did_url, { admin_id });
    return did_url;
}

export function authenticateIssuerAdmin(token: string): string {
    const admin = adminTokens.get(token);
    if (!admin) {
        throw new Error("Invalid admin token");
    }
    return admin.admin_id;
}