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
    body: Record<string, any>
}

// V2: Presentation Definition
export type SSI_ID = string // e.g. ef54dea5-4b6c-4447-b46f-4600edbc93a8
type CredentialType = string // e.g. Somethng like "VerifiableCredential" or "DriversLicense"

export interface VerifierV2RequestReturn {
    presentation_definition: PresentationDefinition,
    state: string
}

export interface PresentationDefinition {
    id: SSI_ID,
    input_descriptors: PresentationDescriptor[]
}

interface PresentationDescriptor {
    id: CredentialType, // Should be type, but spec requires this to be id :(
    contraints: {
        fields: DescriptorField[]
    }
}

interface DescriptorField {
    path: string[]
}

export interface PresentationSubmission {
    id: SSI_ID,
    definition_id: SSI_ID,
    descriptor_map: PresentationSubmissionDescriptor[]
}

export interface PresentationSubmissionDescriptor {
    id: CredentialType,
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
    id: SSI_ID
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