
let auth_codes: Map<string, {client_id: string, scope: string}> = new Map();
let tokens: Map<string, {client_id: string, scope: string}> = new Map();

export function authorize(client_id: string, client_secret: string, redirect_uri: string, state: string, scope: string): string {
    // do stuff
    const auth_code = (Math.random() + 1).toString(36).substring(2);
    auth_codes.set(auth_code, {client_id, scope});
    return `${redirect_uri}?code=${auth_code}&state=${state}`;
}

export function token(client_id: string, auth_code: string): string {
    const request = auth_codes.get(auth_code);
    if (request === undefined) {
        // throw new Error("Bad Auth Code");
        return ""
    }
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