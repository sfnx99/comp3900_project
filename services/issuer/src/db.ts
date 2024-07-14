import { Format, Credential } from "./types";

let formats: Format[] = [];
let credentials: Credential[] = [];

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