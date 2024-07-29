import { Format, Credential, CredentialLog, User } from "./types.js";

let formats: Format[] = [];
const credentials: CredentialLog[] = [];
const users: User[] = [
    {client_id: "bob@test.com", info: {"firstName":"bob", "lastName":"smith", "licenseNo":"234955",  "expiryDate": "10/2025", "dob": "1/1/2000"} },
    { client_id: "james@test.com", info: {"firstName":"james", "lastName":"smith",  "expiryDate": "10/2026", "dob": "8/1/1969"}}
];

export function editUser(client_id: string, info: {[key: string] : string}) {
    for (const i in users) {
        if (users[i].client_id === client_id) {
            users[i].info = info;
            return;
        }
    }
    throw new Error(`editUser: user ${client_id} does not exist`);
}

export function getUser(client_id: string) {
    for (const user of users) {
        if (user.client_id === client_id) {
            return user;
        }
    }
    throw new Error(`getUser: user ${client_id} does not exist`);
}

export function addUser(client_id: string, info: {[key: string] : string}) {
    users.push({ client_id, info });
}

export function getCredential(client_id: string, format: string): Credential {
    if (format != formats[0].id) {
        console.log(`Failed to obtain credential: requested format ${format} does not match expected format ${formats[0].id}`);
        throw new Error(`Cannot issue credential with format ${format}`);
    }
    const user = getUser(client_id);
    const neededFields = Object();
    for (const key of formats[0].fields) {
        if (!Object.keys(user.info).includes(key)) {
            console.log(`Failed to obtain credential: user ${client_id} does not have a known ${key}`);
            throw new Error(`Cannot issue format ${format}: user has no known ${key}`);
        }
        neededFields[key] = user.info[key];
    }
    return {
        client_id: user.client_id,
        format: format,
        fields: neededFields
    }
}

export function getFormats() {
    return formats;
}

export function setFormats(new_formats: Format[]) {
    formats = new_formats;
}

export function logCredential(credential: CredentialLog) {
    credentials.push(credential);
    if (credentials.length > 10) {
        credentials.shift();
    }
}

export function getCredentials() {
    return credentials;
}