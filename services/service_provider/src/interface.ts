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
}

export interface Data {
    users: User[],
    issuers: string[],
    sessions: SessionData[]
}

export interface ResponseV2 {
    status: HttpStatusCode,
    body: Record<string, any>  // eslint-disable-line @typescript-eslint/no-explicit-any
}

// V2: Presentation Definition
export type SSI_ID = string // e.g. ef54dea5-4b6c-4447-b46f-4600edbc93a8
type CredentialType = string // e.g. Somethng like "VerifiableCredential" or "DriversLicense"

export interface VerifierV2Request {
    presentation_definition: PresentationDefinition,
    state: string
}

export interface PresentationDefinition {
    id: SSI_ID,
    input_descriptors: PresentationDescriptor[]
}

interface PresentationDescriptor {
    id: CredentialType,
    constraints: {
        fields: DescriptorField[]
    }
}

interface DescriptorField {
    path: string[]
}

export interface PresentationSubmission {
    id: SSI_ID, // Create specifically for this presentation
    definition_id: SSI_ID, // The ID of the presentation you are creating a submission for.
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
    verifiableCredential: VerifiableCredentialV2[]
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

export interface CredentialProof {
    type: string,
    cryptosuite: string,
    verificationMethod: string,
    proofPurpose: string,
    proofValue: string
}

export interface VerifiableCredentialProof extends Omit<CredentialProof,"proofValue"> {
    proofValue: string[]
}

export interface VerifiableCredentialV2 extends Omit<CredentialV2,"proof"> {
    proof: VerifiableCredentialProof
}

// V2: Session Data
export type SessionData = {
    session_id: string,
    user: User
    active_presentation_request: PresentationDefinition | undefined
}

export interface disclosedMessages {
    disclosedMessages: Uint8Array[],
    disclosedMessageIndexes: number[]
}

export interface PresentationLog {
    issuer: string,
    type: string,
    cryptosuite: string,
    credential: {[key: string] : string},
    status: "denied" | "accepted"
}