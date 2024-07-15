import { Data, SessionData, User } from './interface'

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
            credentialsV2: [{
                '@context': [],
                id: 'e8b08949-8369-48d2-9d6f-2a1c2f1d52ec',
                type: ["VerifiableCredential", "CredentialType1"],
                issuer: 'did:exampleissuer:12345',
                credentialSubject: {
                    "firstName": "John",
                    "lastName": "Smith"
                },
                proof: {
                    type: '',
                    cryptosuite: 't11a-bookworms-bbs',
                    verificationMethod: '',
                    proofPurpose: '',
                    proofValue: ''
                }
            }]
        }
    ],
    issuers: [
        "http://localhost:8082" // hardcoded
    ],
    sessions: []
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
export function toUser(token: string): User | undefined {
    const session_data = toSessionData(token)
    return session_data?.user
}

export function toSessionData(token: string): SessionData | undefined {
    const data = getData();
    const sliced_token = token.slice(7)
    return data.sessions.find(s => s.session_id === sliced_token)
}