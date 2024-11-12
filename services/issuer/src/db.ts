import { Format, Credential, CredentialLog, User, IssuerAdmin } from "./types.js";

let formats: Format[] = [];
const credentials: Credential[] = []; // Credential list
const credentialLogs: CredentialLog[] = []; // Credential log
const users: User[] = [
    { client_id: "bob@test.com", info: { "firstName": "bob", "lastName": "smith", "zID": "z1234567", "dob": "1/1/2000", "USI": "234955", "faculty": "Engineering", "expiryDate": "10/2025", "program": "Software Engineering", "COMP3900Grade": "HD" } },
    { client_id: "james@test.com", info: { "firstName": "james", "lastName": "smith", "zID": "z7654321", "dob": "8/1/1969", "USI": "123456", "faculty": "Science", "expiryDate": "10/2026", "program": "Computer Science", "COMP3900Grade": "DN" } }
];

const issuerAdmins: IssuerAdmin[] = [
    {
        admin_id: 'unsw@gmail.com',
        info: {
            admin_secret: '1234',
            token: 'xyz' 
        }
    }
];

// User management functions
export function editUser(client_id: string, info: { [key: string]: string }) {
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

export function addUser(client_id: string, info: { [key: string]: string }) {
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
    credentialLogs.push(credential);
    if (credentialLogs.length > 10) {
        credentialLogs.shift();
    }
}

export function getCredentialLog(format: string): CredentialLog[] {
    for (const log of credentialLogs) {
        if (log.credential.format === format) {
            return [log];
        }
    }
    return [];
}


export function getCredentialLogs() {
    return credentialLogs;
}

export function getCredentials() {
    return credentials;
}

export function addCredentialLog(credential: CredentialLog): void {
    credentialLogs.push(credential);
}

// Issuer admin management functions
export function editIssuerAdmin(admin_id: string, info: { [key: string]: string }) {
    for (const i in issuerAdmins) {
        if (issuerAdmins[i].admin_id === admin_id) {
            issuerAdmins[i].info = { ...issuerAdmins[i].info, ...info };
            return;
        }
    }
    throw new Error(`editIssuerAdmin: admin ${admin_id} does not exist`);
}

export function getIssuerAdmin(admin_id: string) {
    for (const admin of issuerAdmins) {
        if (admin.admin_id === admin_id) {
            return admin;
        }
    }
    throw new Error(`getIssuerAdmin: admin ${admin_id} does not exist`);
}

export function addIssuerAdmin(admin_id: string, info: { [key: string]: string }) {
    issuerAdmins.push({ admin_id, info });
}
