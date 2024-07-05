import axios, { HttpStatusCode } from 'axios';
import { FORMAT_MAP, toUser } from './data';
import { ResponseV2, User, VerifierV2RequestReturn } from './interface';

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


export async function getPresentationV2(user: User, verifier: string): Promise<ResponseV2> {
    const verifierRequest = verifier + "/v2/request";
    const res: VerifierV2RequestReturn = JSON.parse(await axios.get(verifierRequest));
    const descriptor = res.presentation_definition.input_descriptors[0] // TODO: Fix this in sprint 3 (project requires only one input descriptor for sprint 2)
    // For each input descriptor listed in the Presentation, Find a Credential Owned by the user.
    const userCred = user.credentialsV2.find(c => c.type.includes(descriptor.id))
    if (userCred === undefined) {
        return {
            status: HttpStatusCode.Forbidden,
            body: {
                error: "User Lacks Required Credentials for Presentation."
            }
        }
    }
    // User has required credentials. Ensure that they have the right proofs, too.
    
    const presentation = {
        type: descriptor.id,
        requiredAttributes: descriptor.contraints.fields.map(f => f.path[0].lastIndexOf('.'))
    }
    return {
        status: 200,
        body: presentation
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