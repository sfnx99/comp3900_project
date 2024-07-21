// import { resolve } from '@decentralized-identity/ion-tools';
// @ts-expect-error no types in module
import * as bbs from '@digitalbazaar/bbs-signatures';
import axios from 'axios';
import { CredentialSubject, disclosedMessages, Presentation, PresentationSubmission, ResponseV2 } from './interface';
import { getDefinition, trusted } from './db';

function getCredentialSubjectName(input: string): string {
    const lastIndex = input.lastIndexOf('.');
    if (lastIndex === -1) {
        return input; // If no period is found, return the whole input
    }
    return input.substring(lastIndex + 1);
}

async function getRequiredAttributes(): Promise<string[]> {
    const presDesc = getDefinition();
    return presDesc.input_descriptors[0].constraints.fields.map(f => getCredentialSubjectName(f.path[0]))
}

function getGivenAttributes(pres: Presentation, vcIndex: number): string[] {
    const keysArray: string[] = Object.keys(pres.verifiableCredential[vcIndex].credentialSubject);
    return keysArray;
}

async function checkConstraints(pres: Presentation, vcIndex: number): Promise<boolean> {
    const requiredCredentialFields = await getRequiredAttributes();
    const givenCredentialFields = getGivenAttributes(pres, vcIndex);

    const checkSubset = (parentArray: string[], subsetArray: string[]) => {
        return subsetArray.every((el) => {
            return parentArray.includes(el)
        })
    }

    return checkSubset(givenCredentialFields, requiredCredentialFields);
}

async function obtainKey(pres: Presentation, vcIndex: number) { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
        /*const uri = pres.verifiableCredential[vcIndex].issuer;
        let doc = await resolve(uri);
        return doc.didDocument.service[0].serviceEndpoint;*/
        const resp = await axios.get("http://localhost:8082/");
        return resp.data.bbs_public_key;
    } catch (error) {
        if (error) {
            return {
                status: 400,
                body: {
                    message: "Failed to resolve DID to relevant DIDDoc."
                }
            }
        }
    }
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
    // const result = kvp_list.reduce((acc, val) => acc[val.key] = val.value, Object())
    const result = Object();
    for (const {key, value} of kvp_list) {
        result[key] = value;
    }
    return result;
}

function constructChunks(pres: Presentation, vcIndex: number): disclosedMessages {
    const vc = pres.verifiableCredential[vcIndex];
    const filteredCredSubject = credentialSubject_to_indexed_kvp(vc.credentialSubject);

    const initialChunk = JSON.stringify({
        "@context": vc['@context'],
        "type": vc.type,
        "issuer": vc.issuer
    })

    const dataChunks = filteredCredSubject
        .map(cs => indexed_key_value_pairs_to_object([cs]))
        .map(obj => JSON.stringify(obj));

    const finalChunk = JSON.stringify({
        type: pres.verifiableCredential[0].proof.type,
        cryptosuite: pres.verifiableCredential[0].proof.cryptosuite,
        // verificationMethod: pres.verifiableCredential[0].proof.verificationMethod,
        proofPurpose: pres.verifiableCredential[0].proof.proofPurpose
    })
    const filteredChunks = [initialChunk, ...dataChunks, finalChunk].map(c => new TextEncoder().encode(c));
    const indexes = JSON.parse(vc.proof.proofValue[0]);
    

    return {
        disclosedMessages: filteredChunks,
        disclosedMessageIndexes: indexes
    }
}

async function validateProof(publicKey: Uint8Array, proof: Uint8Array, messages: disclosedMessages): Promise<boolean> {
    const header = new Uint8Array();
    const presentationHeader = new Uint8Array();
    const { disclosedMessages, disclosedMessageIndexes } = messages;
    const verified_selective = await bbs.verifyProof({
        publicKey, proof, header, presentationHeader, disclosedMessages, disclosedMessageIndexes,
        ciphersuite: 'BLS12-381-SHA-256'
    });
    return verified_selective;
}

async function validateDefinition(presSub: PresentationSubmission): Promise<boolean> {
    const defs = getDefinition();
    return presSub.definition_id === defs.id;
}

async function identifyVC(presSub: PresentationSubmission): Promise<string> {
    const defs = getDefinition();
    const presDesc = defs.input_descriptors;
    const presMap = presSub.descriptor_map;
    const commonFormats: string[] = [];

    presMap.forEach(function (descriptor, i) { // eslint-disable-line @typescript-eslint/no-unused-vars
        for (const value of presDesc) {
            if (value.id === descriptor.id) {
                commonFormats.push(descriptor.path);
            }
        }
    });

    if (commonFormats[0] === null) {
        return "invalid";
    }

    return commonFormats[0];
}

export async function presentSubmission(presSub: PresentationSubmission, pres: Presentation, state: string): Promise<ResponseV2> { // eslint-disable-line @typescript-eslint/no-unused-vars
    /*
    //  Validate ID of presentation definition matches the one provided as
    //  compared to the one given in the presentation submission.
    */
    if (!validateDefinition(presSub)) {
        return {
            status: 500,
            body: {
                message: "Incorrect presentation definition."
            }
        }
    }

    /*
    //  Determine the number of VPs returned in the VP Token and identify in which VP which requested VC is included,
    //  using the Input Descriptor Mapping Object(s) in the Presentation Submission.
    */
    const extractFirstNumber = (str: string) => (str.match(/\d+/) ? parseInt(str.match(/\d+/)![0], 10) : null);
    const vcP = await identifyVC(presSub);
    const vcIndex = extractFirstNumber(vcP);
    if (vcIndex === null) {
        return {
            status: 400,
            body: {
                message: "Provided verifiable credential does not match to a credential provided in the Presentation Definition."
            }
        }
    }

    /*
    //  Confirm that the returned Credential(s) meet all criteria sent
    //  in the Presentation Definition in the Authorization Request.
    */
    if (!checkConstraints(pres, vcIndex)) {
        return {
            status: 400,
            body: {
                message: "Not all required credentials disclosed."
            }
        }
    }

    /*
    //  If applicable, perform the checks on the Credential(s) specific to the Credential Format
    //  (i.e., validation of the signature(s) on each VC).
    */
    const publicKeyObj = await obtainKey(pres, vcIndex);
    const publicKey = new Uint8Array(Object.values(publicKeyObj));
    const proofStr = pres.verifiableCredential[vcIndex].proof.proofValue[1];
    const proof = new Uint8Array(Object.values(JSON.parse(proofStr)));
    if (!await validateProof(publicKey, proof, constructChunks(pres, vcIndex))) {
        return {
            status: 400,
            body: {
                message: "Proof unable to be validated. Credential denied."
            }
        }
    }

    // Check issuer is trusted by this verifier
    if (!trusted(pres)) {
        return {
            status: 400,
            body: {
                message: "Issuer not trusted"
            }
        }
    }

    return {
        status: 200,
        body: {
            message: "Proof successfully recreated. Credential verified."
        }
    }

    /*
    //  Perform the checks required by the Verifier's policy,
    //  based on the set of trust requirements such as trust frameworks it belongs to (i.e., revocation checks), if applicable.
    */
}