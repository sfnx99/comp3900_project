import { HttpStatusCode } from 'axios';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SALT_ROUNDS, getData, setData } from './data';
import { ResponseV2, SessionData } from './interface';

export function authRegisterV2(email: string, password: string) : ResponseV2 {
    const data = getData();

    // Check email and password are not empty strings
    if (!validateEmail(email)) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: 'Provided email address is not valid'
            }
        }
    }
    
    if (!validatePassword(password)) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: 'Password must contain at least one character'
            }
        }
    }

    // Check email already exists
    if (data.users.map(e => e.email).includes(email)) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: 'Email address in use'
            }
        }
    }

    // Generate password hash
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);

    // Store in memory and generate session
    data.users.push({
        email: email,
        hash: hash,
        credentials: [],
        credentialsV2: []
    });
    setData(data);

    // Login to new account
    const session = authLoginV2(email, password).body.token
    return {
        status: 200,
        body: {
            token: session
        }
    };
}
// V2

export function authLoginV2(email: string, password: string): ResponseV2 { 
    const data = getData();
    const associated_user = data.users.find(e => e.email === email)

    if (associated_user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid email or password"
            }
        }
    }
    const password_correct = bcrypt.compareSync(password, associated_user!.hash)
    // Something went wrong
    if (!password_correct) {
        return {
            status: 401,
            body: {
                error: "Invalid email or password"
            }
        }
    }

    // Log in and generate session
    const session = uuidv4();
    const session_data: SessionData = {
        session_id: session,
        user: associated_user,
        active_presentation_request: undefined
    }
    data.sessions.push(session_data);
    setData(data);

    return {
        status: 200,
        body: {
            token: session
        }
    };
}

// V2
export function authLogoutV2(session_data: SessionData): ResponseV2 {
    // Invalidate session
    const data = getData()
    if (data.sessions.find(s => s === session_data) === undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: {
                error: "Invalid Session. Cannot log out an invalid session."
            }
        }
    }
    data.sessions = data.sessions.filter(s => s !== session_data)
    setData(data)
    return {
        status: 200,
        body: {}
    }
}

function validateEmail(email: string) {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function validatePassword(password: string) {
    return password // Checks if password is an empty string
}