export function createCredential(information: any, issuerPrivateKey: number[]) {
    const credential = {
        information: information,
        signature: generateDigitalSignature(information, issuerPrivateKey),
    }
    return credential
}

// For now this just generates a random number
function generateDigitalSignature(information: any, issuerPrivateKey: number[]) {
    return Math.random()
}