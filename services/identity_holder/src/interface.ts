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
    sessions: string[]
}

export interface Data {
    users: User[],
    issuers: string[]
}

export interface Response {
    status: number,
    body: Attribute
}