import { HttpStatusCode } from 'axios';
import { getData, setData, toUser } from './data';
import { ResponseV2, SSI_ID, User } from './interface';

export function getCredentials(token: string) {
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }
    return {
        status: 200,
        body: {
            credentials: user.credentials.map(e => e.id)
        }
    };
}

export function getCredential(token: string, id: string) {
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }

    if (!user.credentials.map(e => e.id).includes(id)) {
        return {
            status: 400,
            body: {
                error: "Invalid credential ID"
            }
        }
    }

    return {
        status: 200,
        body: user.credentials.find(e => e.id === id)
    };
}

export function deleteCredential(token: string, id: string) {
    const data = getData();
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }

    if (!user.credentials.map(e => e.id).includes(id)) {
        return {
            status: 400,
            body: {
                error: "Invalid credential ID"
            }
        }
    }

    user.credentials = user.credentials.filter(e => e.id !== id);

    setData(data);

    return {
        status: 200,
        body: {}
    };
}

export function getCredentialsV2(user: User): ResponseV2 {
    const credentials = user.credentialsV2.map(c => c.id)
    return {
        status: 200,
        body: {
            credentials: credentials
        }
    };
}

export function getCredentialV2(user: User, credential_id: SSI_ID): ResponseV2 {
    const credential = user.credentialsV2.find(c => c.id === credential_id)
    if (credential === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Credential Not Found."
            }
        }
    }
    const credential_subject = Object.assign({}, credential.credentialSubject); // Do this to prevent changes to the credential when we assign the id
    credential_subject["id"] = credential.id;
    return {
        status: 200,
        body: {
            credentials: {
                "issuer": credential.issuer,
                "type": credential.type,
                "cryptosuite": credential.proof.cryptosuite,
                "credential": credential_subject
            }
        }
    };
}