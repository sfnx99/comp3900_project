import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SALT_ROUNDS, getData, setData, toUser } from './data';
import { ResponseV2 } from './interface';

export function authRegister(email: string, password: string) : ResponseV2 {
    const data = getData();

    // Check email already exists
    if (data.users.map(e => e.email).includes(email)) {
        return {
            status: 400,
            body: {
                error: 'Email address in use'
            }
        }
    }

    // Generate password hash
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);

    // Store in memory and generate session
    const session = uuidv4();
    data.users.push({
        email: email,
        hash: hash,
        credentials: [],
        credentialsV2: [],
        sessions: [session]
    });
    setData(data);

    return {
        status: 200,
        body: {
            token: session
        }
    };
}

export function authLogin(email: string, password: string) { 

    const data = getData();
    let invalidFlag = false;
    // Check email exists
    if (!data.users.map(e => e.email).includes(email)) {
        invalidFlag = true;
    } else {
        // Check password correct
        if (!bcrypt.compareSync(password, data.users.find(e => e.email === email)!.hash)) {
            invalidFlag = true
        }
    }

    // Something went wrong
    if (invalidFlag) {
        return {
            status: 401,
            body: {
                error: "Invalid email or password"
            }
        }
    }

    // Log in and generate session
    const session = uuidv4();
    data.users.find(e => e.email === email)?.sessions.push(session);
    setData(data);

    return {
        status: 200,
        body: {
            token: session
        }
    };
}

export function authLogout(token: string) {
    // Find user in question
    const data = getData();
    const user = toUser(token);

    // Bad token
    if (user === undefined) {
        return {
            status: 400,
            body: {
                error: "Cannot invalidate session; session does not exist"
            }

        }
    }

    // Invalidate session
    user.sessions = user.sessions.filter(e => e != token);
    setData(data);

    return {
        status: 200,
        body: {}
    }
}