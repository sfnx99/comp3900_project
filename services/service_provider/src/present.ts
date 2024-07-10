import { resolve } from "@decentralized-identity/ion-tools";

export function presentSubmission(pres_def: PresentationDefinition, state: String) {
    fs.readFile("./trusted.json", (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            return {
                status: 500
                body: { 
                    message: 'Internal Server Error', 
                    error: parseErr 
                }
            };
        }

        try {
            const trusted = JSON.parse(data.toString());
            const issuer = jsonData.iss;
            if (trusted.issuers.includes(issuer)) {
                return {
                    status: 200
                    body: {
                        message: "Credential Accepted."
                    }
                };
            } else {
                return {
                    status: 403
                    body: {
                        message: "Credential Denied."
                    }
                };
            }
        } catch (parseErr) {
            return {
                status: 500
                body: {
                    message: "Internal Server Error."
                }
            }
        }
    });
}

function checkDescriptor() {
    /* 
        Check decriptor map in presentation submission, obtain presentation definition.
        Check required fields in presentation definition match/exceed credential subject list
        In veriableCredential 
    */
}

function obtainKey() {
    // obtain uri from verifiableCredential[issuer]
    // derefence DIDDoc with uri.
    // let doc = await resolve()
    // Take public key out of doc and return.
}

function constructChunks() {

}

function validateProof() {

}