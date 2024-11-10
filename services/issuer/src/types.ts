export type Format = {
    id: string,
    fields: string[]
}

export type Credential = {
    client_id: string,
    format: string,
    fields: {[key: string] : string}
}

export type User = {
    client_id: string,
    info: {[key: string] : string}
}

export type CredentialLog = {
    client_id: string,
    type: string,
    cryptosuite: string,
    credential: {[key: string] : string}
}