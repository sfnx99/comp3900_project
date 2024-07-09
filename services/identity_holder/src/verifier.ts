import axios, { HttpStatusCode } from 'axios';
import { FORMAT_MAP, toUser } from './data';
import { CredentialSubject, Presentation, PresentationSubmission, PresentationSubmissionDescriptor, ResponseV2, SessionData, SSI_ID, VerifierV2RequestReturn } from './interface';

export async function getPresentation(token: string, verifier: string) {
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }
    const verifierMetadata = verifier + "/v1/metadata";
    try {
        const res = await axios.get(verifierMetadata);
        return {
            status: 200,
            body: {
                formats: res.data.formats
            }
        }
    } catch (err) {
        return {
            status: 500,
            body: {
                err: err
            }
        }
    }
}

export async function makePresentation(token: string, verifier: string, format: "Learner Driver Licence"|"Provisional Driver Licence"|"Driver Licence"|"Photo Card", id: string) {
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }
    // Check credential exists
    const pres = user.credentials.find(e => e.id === id);
    if (pres === undefined) {
        return Promise.resolve({
            status: 400,
            body: {
                error: "No such credential"
            }
        });
    }
    // Check specified presentation conforms to format
    for (const attr in FORMAT_MAP[format]) {
        if (!(attr in pres.cred.map(e => Object.keys(e)[0]))) {
            return Promise.resolve({
                status: 400,
                body: {
                    error: "Specified credential does not match specified format"
                }
            });
        }
    }
    // Send the credential!
    const verifierReceive = verifier + "/v1/receive";
    try {
        const res = await axios.post(verifierReceive, pres);
        if (res.status === 200) {
            return {
                status: 200,
                body: {
                    message: "success"
                }
            };
        } else {
            return {
                status: 500,
                body: {
                    error: "verifier refused presentation"
                }
            }
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



export async function getPresentationV2(session_data: SessionData, verifier: string): Promise<ResponseV2> {
    const verifierRequest = verifier + "/v2/request";
    const res: VerifierV2RequestReturn = JSON.parse(await axios.get(verifierRequest));
    const descriptor = res.presentation_definition.input_descriptors[0] // TODO: Fix this in sprint 3 (project requires only one input descriptor for sprint 2)
    const userCred = session_data.user.credentialsV2.find(
        c => c.type.includes(descriptor.id)
        && descriptor.contraints.fields.every(
            f => getRelativeCredentialValue(f.path, c.credentialSubject) !== undefined)
        )
    if (userCred === undefined) {
        return {
            status: HttpStatusCode.Forbidden,
            body: {
                error: "User Lacks Required Credentials for Presentation."
            }
        }
    }
    // User has required credentials.
    const presentation = {
        type: descriptor.id,
        requiredAttributes: descriptor.contraints.fields.map(f => getCredentialSubjectName(f.path[0]))
    }
    return {
        status: 200,
        body: presentation
    }
}

export async function postPresentationV2(session_data: SessionData, verifier: string, credential_id: SSI_ID): Promise<ResponseV2> {
    const verifierPresent = verifier + "/v2/present";
    const verifiable_credential = session_data.user.credentialsV2[0] //TODO: In sprint 3, make this support multiple credentials.
    if (verifiable_credential === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Client Did not have credential they claimed to have."
            }
        }
    }
    const presentation: Presentation = {
        '@context': ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiablePresentation"],
        verifiableCredential: [verifiable_credential]
    }
    const descriptor_map: PresentationSubmissionDescriptor[] = []
    for (let i = 0; i < verifiable_credential.type.length; i++) {
        const element = verifiable_credential.type[i];
        descriptor_map.push({
            id: element,
            format: 'ldp_vc',
            path: '$.verifiableCredentials[' + i + ']'
        })
    }
    const presentation_submission: PresentationSubmission = {
        id: '', //TODO
        definition_id: credential_id,
        descriptor_map: descriptor_map
    }
    const verifierData = {
        "presentation_submission": presentation_submission,
        "vp_token": presentation,
        "state": "oeih1129"
    }
    const res = await axios.post(verifierPresent, verifierData)
    return {
        status: res.status,
        body: {}
    }
}

function getRelativeCredentialValue(paths: string[], credential_subject: CredentialSubject) {
    try {
        const values = paths.map(path => {
            const keys = path.slice(1).split('.') // TODO: Remove $[] from path instead of slicing.
            let current: any = credential_subject // eslint-disable-line @typescript-eslint/no-explicit-any
            for (let i = 0; i < keys.length; i++) {
                const element = keys[i];
                current = current[element]
            }
            return current
        });
        return values.find(v => v !== undefined)
    } catch (error) {
        return undefined
    }
}

function getCredentialSubjectName(input: string): string {
    const lastIndex = input.lastIndexOf('.');
    if (lastIndex === -1) {
        return input; // If no period is found, return the whole input
    }
    return input.substring(lastIndex + 1);
}
