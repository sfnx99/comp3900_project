import * as fs from 'fs';
import { PresentationDefinition, PresentationLog, Presentation } from './interface';

let definition: PresentationDefinition[] = [];
const presentations: PresentationLog[] = [];
const trustedIssuers: string[] = ["did:ion:EiC9ASap4Tgsc5JztU-DULRDzaqk3ZpS-4UgImIXZ5nwmQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJJMjZmYWhQU1B2c0xqVGxfMWZfVm5QTXJacVcwY0I1S1lYTHhtWHdOUjk4IiwieSI6IkQ2Wmh2RzNWN29pMVBvd2wwZkh1ZmhNUDZiY1EyRDlwNERsT0hVT0lWVHMifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoiYmJzLWtleS0xIiwic2VydmljZUVuZHBvaW50Ijp7ImNyZWRlbnRpYWxfY29uZmlndXJhdGlvbnNfc3VwcG9ydGVkIjp7IkRyaXZlckxpY2VuY2VDcmVkZW50aWFsIjp7ImZvcm1hdCI6ImxkcF92YyJ9LCJQaG90b0NhcmRDcmVkZW50aWFsIjp7ImZvcm1hdCI6ImxkcF92YyJ9fSwiY3JlZGVudGlhbF9lbmRwb2ludCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MiJ9LCJ0eXBlIjoiQkJTS2V5In1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCMnYtZ3NmTWw2V2kyTlZiekFnTE5IRVZ5MWt1bFhub2licUhvVloxS1pUUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHo2TTdIckhhdjRXUTFfS0hVM3VuV0VNdWJkekdxNmZ5OWMzVnFEbTRaX1EiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUFEaG8tZFRXLUhVOXBWVUotcXVDS2p2dnZaUFo3QlB1ZVowZnNyTXAzak9RIn19"];

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