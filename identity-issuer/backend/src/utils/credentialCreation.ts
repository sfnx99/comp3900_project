export function createCredentials(information: any, issuerPrivateKey: number[]) {
    const credential = {
        information,
        generateDigitalSignature(information, issuerPrivateKey)
    }

    return credential
}

// For now this just generates a random number
function generateDigitalSignature(information: any, issuerPrivateKey: number[]) {
    Math.random()
}