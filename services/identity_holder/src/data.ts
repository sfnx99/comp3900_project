import { Data, User } from './interface'

export const DEFAULT_DATA: Data = {
    users: [
        {
            email: "email",
            hash: "$2b$10$F79YjBvFPM3HxC0ppGorOe5qSYCkj6BBc9WZAvTx8F0OzoHqYeuVC",
            credentials: [
                {
                    id: "test",
                    iss: "test",
                    cred: [
                        { first_name: "test" },
                        { last_name: "test" },
                        { dob: "test" }
                    ]
                }
            ],
            credentialsV2: [

            ],
            sessions: []
        }
    ],
    issuers: [
        "http://localhost:8082" // hardcoded
    ]
}

let data = DEFAULT_DATA

export function setData(newData: Data) {
    data = newData
}

export function getData() : Data {
    return data
}

// config
export const SALT_ROUNDS = 10
export const FORMAT_MAP = {
    "Learner Driver Licence": ["first_name", "last_name", "dob"],
    "Provisional Driver Licence": ["first_name", "last_name", "dob"],
    "Driver Licence": ["first_name", "last_name", "dob"],
    "Photo Card": ["first_name", "last_name", "dob"]
}

// helpers
export function toUser(token: string): User|undefined {
    const data = getData();
    return data.users.find(e => e.sessions.includes(token));
}