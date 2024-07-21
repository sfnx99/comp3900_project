import { HttpStatusCode } from 'axios';
import { getData, setData, toUser } from './data';
import { ResponseV2, SessionData, SSI_ID } from './interface';

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

export function getCredentialsV2(session_data: SessionData): ResponseV2 {
    const credentials = session_data.user.credentialsV2.map(c => c.id)
    return {
        status: 200,
        body: {
            credentials: credentials
        }
    };
}

export function getCredentialV2(session_data: SessionData, credential_id: SSI_ID): ResponseV2 {
    const credential = session_data.user.credentialsV2.find(c => c.id === credential_id)
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
            "issuer": credential.issuer,
            "type": credential.type,
            "cryptosuite": credential.proof.cryptosuite,
            "credential": credential_subject
        }
    };
}

export function deleteCredentialV2(session_data: SessionData, credential_id: SSI_ID): ResponseV2 {
    const data = getData()
    const user = session_data.user
    const userIndex = data.users.findIndex(u => u === user)
    if (!user.credentialsV2.map(c => c.id).includes(credential_id)) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Invalid credential ID"
            }
        }
    }
    user.credentialsV2 = user.credentialsV2.filter((cred) => cred.id !== credential_id)
    data.users[userIndex] = user
    setData(data)
    return {
        status: HttpStatusCode.Ok,
        body: {}
    }
}