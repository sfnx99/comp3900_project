export type Format = {
    id: string,
    fields: string[]
}

export type Credential = {
    client_id: string,
    format: string,
    fields: {[key: string] : string}
}