import { Format, Credential } from "./types.js";

let formats: Format[] = [];
const credentials: Credential[] = [
    { client_id: "bob@test.com", format: "DriverLicenceCredential", fields: {"firstName":"bob", "lastName":"smith", "licenseNo":"234955",  "expiryDate": "10/2025", "dob": "1/1/2000"}},
    { client_id: "james@test.com", format: "PhotoCardCredential", fields: {"firstName":"james", "lastName":"smith",  "expiryDate": "10/2026", "dob": "8/1/1969"}},
    { client_id: "sally@test.com", format: "DriverLicenceCredential", fields: {"firstName":"sally", "lastName":"brown", "licenseNo":"5674453",  "expiryDate": "09/2029", "dob": "1/12/1999"}},
    { client_id: "jane@test.com", format: "DriverLicenceCredential", fields: {"firstName":"jane", "lastName":"johnson", "licenseNo":"6905903",  "expiryDate": "02/2025", "dob": "3/11/1899"}},
];

export function getCredentials() {
    return credentials;
}

export function getCredential(client_id: string, format: string): Credential | undefined {
    return credentials.find((c) => c.client_id === client_id && c.format === format);
}

export function getFormats() {
    return formats;
}

export function setFormats(new_formats: Format[]) {
    formats = new_formats;
}

export function addCredential(client_id: string, format: string, fields: {[key: string] : string}) {
    credentials.push({client_id, format, fields})
}