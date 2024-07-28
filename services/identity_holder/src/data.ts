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
        "did:ion:EiApY1Bsqcy4ZO9IqKuV9b5qZ9nwYjzFM5pmvQkj5_fCIw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJzZ3VGb2dfSXVqWlQyRUlOTjZPQ0tuQnlBOXFIcHlwdXR4bEdUZTdKZlBjIiwieSI6InZHWmNNOXJvbGxGZGtNRUhIc3FTSllNZm1hLUV5bzQyOE03TkdnUFU5TmMifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoiYmJzLWtleS0xIiwic2VydmljZUVuZHBvaW50Ijp7ImNyZWRlbnRpYWxfY29uZmlndXJhdGlvbnNfc3VwcG9ydGVkIjp7IkRyaXZlckxpY2VuY2VDcmVkZW50aWFsIjp7ImZvcm1hdCI6ImxkcF92YyJ9LCJQaG90b0NhcmRDcmVkZW50aWFsIjp7ImZvcm1hdCI6ImxkcF92YyJ9fSwiY3JlZGVudGlhbF9lbmRwb2ludCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MiJ9LCJ0eXBlIjoiQkJTS2V5In1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEREtHY0ROallPZmhCQ0lRN2Mzc0R2Q0h2R2o3bDVjODE3bU9rTUJFdGhRZyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRGtvUnlkeFdYdERUX0hpVVVUYmU2S041WEg2d2ZfSlgxSnQwSlRzd3NzOXciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUJ0Q2p0OEVhN1NfTVpuRFMzOF96YmFlMlMyd01mQ0xUNmc3RFVOc3JzdzhnIn19" // hardcoded
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
