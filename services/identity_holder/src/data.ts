import { Data, User } from './interface';

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
                {
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
                },
                {
                    '@context': [],
                    id: 'a3c88949-1234-48d2-9d6f-4f1a2f1d52ab', // New unique ID
                    type: ["VerifiableCredential", "CredentialType2"],
                    issuer: 'did:exampleissuer:67890',
                    credentialSubject: {
                        "firstName": "Jane",
                        "lastName": "Doe"
                    },
                    proof: {
                        type: '',
                        cryptosuite: 't11a-bookworms-bbs',
                        verificationMethod: '',
                        proofPurpose: '',
                        proofValue: ''
                    }
                }
<<<<<<< Updated upstream
            ],
=======
            },
            {
                '@context': [],
                id: 'e8b06949-8369-48d2-9d6f-2a1c2f1d52ec',
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
            }
        ],
>>>>>>> Stashed changes
            sessions: []
        }
    ],
    issuers: [
        "http://localhost:8082" // hardcoded
    ]
};

let data = DEFAULT_DATA;

export function setData(newData: Data) {
    data = newData;
}

export function getData(): Data {
    return data;
}

// config
export const SALT_ROUNDS = 10;
export const FORMAT_MAP = {
    "Learner Driver Licence": ["first_name", "last_name", "dob"],
    "Provisional Driver Licence": ["first_name", "last_name", "dob"],
    "Driver Licence": ["first_name", "last_name", "dob"],
    "Photo Card": ["first_name", "last_name", "dob"]
};

// helpers
export function toUser(token: string): User | undefined {
    const data = getData();
    return data.users.find(e => e.sessions.includes(token));
}
