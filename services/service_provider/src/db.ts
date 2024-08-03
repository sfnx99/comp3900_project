import * as fs from 'fs';
import { PresentationDefinition, PresentationLog, Presentation } from './interface';

let definition: PresentationDefinition[] = [{"id": "wah00!", "input_descriptors": [{"id": "DriverLicenceCredential", "constraints": { "fields": [{ "path": ["$.firstName"] }, { "path": ["$.lastName"]}]}}]}];
const presentations: PresentationLog[] = [];
const trustedIssuers: string[] = ["did:ion:EiDMDECBbDfWCNpMGpZiims2723ymKL-Kin8mlI9d78twQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJhRmp4U2FmWjlSbHBraFJfQTNONGFhX3ZPdFdETVM0b0dJdlpoeG1YVzljIiwieSI6Ii16TTdUbWxWLVdyeTA1Y2hoVmo5ZDY5dnVaeWh6OTVLMHJfMjdBNl9lQjQifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoidmMtZGF0YSIsInNlcnZpY2VFbmRwb2ludCI6eyJjcmVkZW50aWFsX2NvbmZpZ3VyYXRpb25zX3N1cHBvcnRlZCI6eyJEcml2ZXJMaWNlbmNlQ3JlZGVudGlhbCI6eyJmb3JtYXQiOiJsZHBfdmMifX0sImNyZWRlbnRpYWxfZW5kcG9pbnQiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6ODA4MiIsImtleSI6IlsxNjAsMjQxLDIyNiw5MSwyNDIsMTgxLDIyMSw2NCwxNzIsMTIzLDE5NSwyMTgsMjA5LDE5Miw4LDE4NywxNDgsMTEzLDIxMiwyNTUsMjA5LDY5LDE3Nyw5OSwyLDE3MywxMjksMTk2LDE3MCw0Niw1MiwzOCw1LDIyNywxNzIsMTI4LDEyOSwyNTQsNjMsMTg4LDE2MCwxNjEsMTUxLDE1NiwxMzgsMTU1LDQxLDE0Miw5LDEzMCwxNDcsMjUzLDE0MCw2MCwxNDAsMjI0LDE4MywzMiwxODYsMTc4LDI1LDE4OSwyNSwxNTgsMjIsMjQyLDYsNzgsMTI4LDIyMywyMjksMTA2LDE0Nyw5NywzOSwxODUsMTY1LDIyNywyNSwxMDAsMTYyLDExLDY4LDYzLDYxLDU3LDE3MCw3NCwxNTIsOSwzNiw0Nyw1NCwxMTIsMTczLDQyXSIsIm5hbWUiOiJOU1dHb3Zlcm5tZW50In0sInR5cGUiOiJ2Yy1kYXRhIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCRzJrbWcwYmRjZi02MUlqWWxwZUpnSFIwUFhrY1lOajh0MHBXaDRYMGRoUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHJ4SUYtUTRoTVlzODE0VEJmVW1mTFBTcm5IV2JkaF9aRG9NZXdLZTJNQnciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaURzSkFPOTZ5NEc5LXVzLVlVc0ExZlg4T3o4cEFUV3pNZG8tOWg5aDdBYVhRIn19"];

export async function initialiseDefinition() {
    const val = await fs.promises.readFile("presentationDefinitions.json");
    const jsonObject = JSON.parse(val.toString());
    definition = [jsonObject];
}

export function getDefinition() {
    return definition[0];
}

export function modifyDefinition(newDefinition: PresentationDefinition) {
    definition = [newDefinition];
}

export function getPresentations() {
    return presentations;
}

export function logPresentation(pres: PresentationLog) {
    presentations.push(pres);
    if (presentations.length > 10) {
        presentations.shift();
    }
}

export function trusted(pres: Presentation) {
    for (const cred of pres.verifiableCredential) {
        if (!trustedIssuers.includes(cred.issuer)) {
            console.log(`Error: issuer ${cred.issuer} is not trusted`);
            return false;
        }
    }
    return true;
}

export function trust(iss: string) {
    trustedIssuers.push(iss);
}

export function untrust(iss: string) {
    const index = trustedIssuers.indexOf(iss);
    if (index === -1) {
        return;
    }
    trustedIssuers.splice(index, 1);
}