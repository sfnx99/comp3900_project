export type IssuerMetadata = {
    issuer_id: string,
    formats_supported: string[],
}

export type SSICredential = {
    issuer: string,
    credential: Attribute[],
}

export type Attribute = {
    [attr: string] : string,
}