import { getData, setData, toUser } from './data';

export function getCredentials(token: string) {
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
    return {
        status: 200,
        body: {
            credentials: user.credentials.map(e => e.id)
        }
    };
}

export function getCredential(token: string, id: string) {
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