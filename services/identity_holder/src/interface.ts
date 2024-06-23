export interface Credential {
    id: string,
    iss: string,
    cred: any
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
    body: string|any // In an error response, body = error message
}