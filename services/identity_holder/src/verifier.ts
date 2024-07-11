// @ts-ignore
import * as bbs from '@digitalbazaar/bbs-signatures';
// @ts-ignore
import * as did from '@decentralized-identity/ion-tools';
import axios, { HttpStatusCode } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FORMAT_MAP, getData, setData, toUser } from './data';
import { CredentialSubject, CredentialV2, Presentation, PresentationDefinition, PresentationSubmission, PresentationSubmissionDescriptor, ResponseV2, SessionData, SSI_ID, VerifiableCredentialProof, VerifiableCredentialV2, VerifierV2Request } from './interface';


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
    const res: VerifierV2Request = JSON.parse(await axios.get(verifierRequest));
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
    // Update session data.
    const data = getData()
    session_data.active_presentation_request = res.presentation_definition
    setData(data) // Does this work? FIXME

    // User has required credentials.
    const return_value = {
        type: descriptor.id,
        requiredAttributes: get_required_attributes(res.presentation_definition)
    }
    return {
        status: 200,
        body: return_value
    }
}

function get_required_attributes(definition: PresentationDefinition): string[] {
    return definition.input_descriptors[0].contraints.fields.map(f => getCredentialSubjectName(f.path[0]))
}

export async function postPresentationV2(session_data: SessionData, verifier: string, credential_id: SSI_ID): Promise<ResponseV2> {
    const verifierPresent = verifier + "/v2/present";
    const credential = session_data.user.credentialsV2[0] //TODO: In sprint 3, make this support multiple credentials.
    if (credential === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Client Did not have credential they claimed to have."
            }
        }
    }
    if (session_data.active_presentation_request === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Client has no active presentation request. Obtain verifiers required presentation request first."
            }
        }
    }
    const verifiable_credential = await create_verifiable_credential(credential, session_data.active_presentation_request)
    if (verifiable_credential === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Unable to conform to Verifiable Credential Request."
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
        id: uuidv4(),
        definition_id: session_data.active_presentation_request.id,
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

function credentialSubject_to_indexed_kvp(credentialSubject: CredentialSubject) {
    const key_value_pairs = Object.entries(credentialSubject);
    const result = []
    for (let index = 0; index < key_value_pairs.length; index++) {
        const kvp = key_value_pairs[index]
        const key = kvp[0]
        if (key === "id") {
            // Dont allow Verifier to inspect did.
            continue
        }
        result.push({
            index: index + 1, // BBS is zero-indexed, and index 0 is the header of the payload. Thus, credentialSubject is 1-indexed.
            key: key,
            value: kvp[1]
        })
    }
    return result
}
function indexed_key_value_pairs_to_object(kvp_list: {index: number,key: string,value: string}[]) {
    return kvp_list.reduce((acc, val) => acc[val.key] = val.value, Object())
}

/**
 * This function turns a credential into a verifiable credential by conforming to a presentation_request.
 * Basically, we need to omit some values in `credential.credentialSubject`, according to 
 * 
 * @param credential 
 * @param presentation_request 
 * @returns 
 */
async function create_verifiable_credential(credential: CredentialV2, presentation_request: PresentationDefinition): Promise<VerifiableCredentialV2 | undefined> {
    const credentialSubject_attributes = get_required_attributes(presentation_request)
    const non_did_credentialSubject = credentialSubject_to_indexed_kvp(credential.credentialSubject)
    const filtered_credentialSubject = non_did_credentialSubject.filter(kvp => credentialSubject_attributes.includes(kvp.key))    
    const proof = await create_verifiable_credential_proof(credential, presentation_request)
    if (proof === undefined) {
        return undefined
    }
    return {
        '@context': credential['@context'],
        id: credential.id,
        type: credential.type,
        issuer: credential.issuer,
        // Changed values below
        proof: proof,
        credentialSubject: indexed_key_value_pairs_to_object(filtered_credentialSubject)
    }
}

/**
 * This one builds a verifiable credential proof
 * @param credential 
 * @param presentation_request 
 */
async function create_verifiable_credential_proof(credential: CredentialV2, presentation_request: PresentationDefinition): Promise<VerifiableCredentialProof | undefined> {
    const credentialSubject_attributes = get_required_attributes(presentation_request)
    const non_did_credentialSubject = credentialSubject_to_indexed_kvp(credential.credentialSubject)
    const filtered_credentialSubject = non_did_credentialSubject.filter(kvp => credentialSubject_attributes.includes(kvp.key))

    const initial_chunk = JSON.stringify({
        "@context": credential['@context'],
        "type": credential.type,
        "issuer": credential.issuer
    })
    const all_data_chunks = non_did_credentialSubject
        .map(cs => indexed_key_value_pairs_to_object([cs]))
        .map(obj => JSON.stringify(obj))
    const filtered_data_chunks = filtered_credentialSubject
        .map(cs => indexed_key_value_pairs_to_object([cs]))
        .map(obj => JSON.stringify(obj))
    
    const last_chunk = JSON.stringify({
        type: credential.proof.type,
        cryptosuite: credential.proof.cryptosuite,
        verificationMethod: credential.proof.verificationMethod,
        proofPurpose: credential.proof.proofPurpose
    })
    const last_chunk_index = non_did_credentialSubject.map(i => i.index).reduce((acc, val) => Math.max(acc, val)) + 1
    const header = new Uint8Array();
    const issuer_publicKey = dereference_DID_to_public_key(credential.proof.verificationMethod)
    const ciphersuite = "BLS12-381-SHA-256"
    const all_chunks = [initial_chunk, ...all_data_chunks, last_chunk].map(c => new TextEncoder().encode(c))
    const filtered_chunks = [initial_chunk, ...filtered_data_chunks, last_chunk].map(c => new TextEncoder().encode(c))
    const filtered_chunk_indexes = [0,...filtered_credentialSubject.map(cs => cs.index).sort((a,b) => a-b), last_chunk_index]
    const verified = await bbs.verifySignature({
        publicKey: issuer_publicKey,
        signature: credential.proof.proofValue,
        header: header,
        messages: all_chunks,
        ciphersuite: ciphersuite
      }
    )
    if (!verified) {
        return undefined
    }
    const proof: string = await bbs.deriveProof({
        publicKey: issuer_publicKey,
        signature: credential.proof.proofValue,
        header: header,
        messages: filtered_chunks,
        presentationHeader: header,
        disclosedMessageIndexes: filtered_chunk_indexes,
        ciphersuite: ciphersuite
    });
    const verifiable_credential_proof: VerifiableCredentialProof = {
        proofValue: [proof, credential.proof.proofValue],
        type: credential.proof.type,
        cryptosuite: credential.proof.cryptosuite,
        verificationMethod: credential.proof.verificationMethod,
        proofPurpose: credential.proof.proofPurpose
    }
    return verifiable_credential_proof
}

/**
 * This function takes in a did_uri, and then returns the public key associated.
 * @param did_uri The did, ie. "did:issuer:12345" or smth
 */
async function dereference_DID_to_public_key(did_uri: string) {
    const didDoc = await did.resolve(did_uri)
    return didDoc.didDocument.service[0].serviceEndpoint
}