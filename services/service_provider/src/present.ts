import * as bbs from '@digitalbazaar/bbs-signatures';
import { resolve } from '@decentralized-identity/ion-tools';
import { readDefinitions } from './request';
import { disclosedMessages, Presentation, PresentationDefinition, PresentationSubmission, ResponseV2 } from './interface';

function getCredentialSubjectName(input: string): string {
    const lastIndex = input.lastIndexOf('.');
    if (lastIndex === -1) {
        return input; // If no period is found, return the whole input
    }
    return input.substring(lastIndex + 1);
}

function getRequiredAttributes(): string[] {
    const presDesc = readDefinitions();
    return presDesc.input_descriptors[0].contraints.fields.map(f => getCredentialSubjectName(f.path[0]))
}

function getGivenAttributes(): string[] {
    const 
}

function checkCredentialFields(presSub: PresentationSubmission, pres: Presentation): Boolean {
    const requiredCredentialFields = getRequiredAttributes();
    const givenCredentialFields = getGivenAttributes();

    let checkSubset = (parentArray: string[], subsetArray: string[]) => {
        return subsetArray.every((el) => {
            return parentArray.includes(el)
        })
    }

    return checkSubset(givenCredentialFields, requiredCredentialFields);
}

async function obtainKey(pres: Presentation) {
    try {
        const uri = pres.verifiableCredential[0].issuer;
        let doc = await resolve(uri);
        return doc.didDocument.service[0].serviceEndpoint;
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

function constructChunks(): disclosedMessages {
    return {
        disclosedMessages: '',
        disclosedMessageIndexes: ''
    }
}

async function validateProof(publicKey: string, proof: string, messages: disclosedMessages): Promise<Boolean> {
    const header = new Uint8Array();
    const presentationHeader = new Uint8Array();
    const { disclosedMessages, disclosedMessageIndexes } = messages;

    const verified_selective = await bbs.verifyProof({
        publicKey, proof, header, presentationHeader, disclosedMessages, disclosedMessageIndexes,
        ciphersuite: 'BLS12-381-SHA-256'
    });

    return verified_selective;
}

export async function presentSubmission(presSub: PresentationSubmission, pres: Presentation, state: String): Promise<ResponseV2> {
    if (!checkCredentialFields(presSub, pres)) {
        return {
            status: 500,
            body: {
                message: "Not all required credentials disclosed."
            }
        }
    }

    const publicKey = obtainKey(pres);
    const proof = '';
    if (!validateProof(await publicKey, proof, constructChunks())) {
        return {
            status: 400,
            body: {
                message: "Proof unable to be validated. Credential denied."
            }
        }
    }

    return {
        status: 200,
        body: {
            message: "Proof successfully recreated. Credential verified."
        }
    }
}