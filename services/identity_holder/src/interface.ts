import { HttpStatusCode } from "axios"

export type Attribute = {
    [attr: string] : string,
}

export interface Credential {
    id: string,
    iss: string,
    cred: Attribute[]
}

export interface User {
    email: string,
    hash: string,
    credentials: Credential[]
    credentialsV2: CredentialV2[]
    sessions: string[]
}

export interface Data {
    users: User[],
    issuers: string[]
}

export interface ResponseV2 {
    status: HttpStatusCode,
    body: Object
}

// V2: Presentation Definition

type CredentialType = string
type CredentialPath = string

export interface VerifierV2RequestReturn {
    presentation_definition: PresentationDefinition,
    state: string
}

export interface PresentationDefinition {
    id: string,
    input_descriptors: PresentationDescriptor[]
}

interface PresentationDescriptor {
    id: CredentialType, // Should be type, but spec requires this to be id :(
    contraints: {
        fields: DescriptorField[]
    }
}

interface DescriptorField {
    path: CredentialPath[]
}

export interface PresentationSubmission {
    id: string,
    definition_id: string,
    descriptor_map: PresentationSubmissionDescriptor[]
}

export interface PresentationSubmissionDescriptor {
    id: string,
    format: string,
    path: string
}

export interface Presentation {
    "@context": string[],
    type: CredentialType[],
    verifiableCredential: CredentialV2[]
}

// V2 Credentials
export interface CredentialV2 {
    "@context": string[],
    type: CredentialType[],
    issuer: string,
    credentialSubject: CredentialSubject,
    proof: CredentialProof
}

export interface CredentialSubject {
    [attr: string] : string
}

interface CredentialProof {
    type: string,
    cryptosuite: string,
    verificationMethod: string,
    proofPurpose: string,
    proofValue: string
}