type IssuerMetadata = {
    issuer_id: string,
    formats_supported: string[],
}

type SSICredential = {
    issuer: string,
    credential: Attribute[],
}

type Attribute = {
    [attr: string] : string,
}