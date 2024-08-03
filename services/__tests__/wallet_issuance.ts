// Tests all of the Wallet functions that don't depend on integration.

import { getData, setData } from "../identity_holder/src/data"
import { Data, User } from "../identity_holder/src/interface"
import { getIssuersV2 } from "../identity_holder/src/issuer"

describe('Wallet V2: Issuance', () => {
    beforeEach(() => {
        setData(Object.assign({}, TEST_DATA))
    })

    test('Test v2/issuers', async ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        expect((await getIssuersV2(user1_session)).body.issuers).toEqual(["http://localhost:8082", "http://google.com"])
    })
})

const TEST_USER_1: User = {
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
                type: 'DataIntegrityProof',
                cryptosuite: 't11a-bookworms-bbs',
                verificationMethod: 'did:exampleissuer:12345/key-1',
                proofPurpose: 'asertionMethod',
                proofValue: 'bbs-signature' //TODO
            }
        },
        {
            '@context': [],
            id: 'a07903b3-77be-482c-a3ca-a7cfec2a23ba',
            type: ["VerifiableCredential", "CredentialType2"],
            issuer: 'did:exampleissuer2:67890',
            credentialSubject: {
                "firstName": "John",
                "middleName": "Alison",
                "lastName": "Smith"
            },
            proof: {
                type: 'DataIntegrityProof',
                cryptosuite: 't11a-bookworms-bbs',
                verificationMethod: 'did:exampleissuer2:67890/key-56',
                proofPurpose: 'asertionMethod',
                proofValue: 'bbs-signature' //TODO
            }
        }
    ]
};

const TEST_DATA: Data = {
    users: [TEST_USER_1],
    issuers: [
        "http://localhost:8082", // hardcoded
        "http://google.com"
    ],
    sessions: [{
        session_id: "aaaaa-aaaa-aaaaaa-aaaaa",
        user: TEST_USER_1,
        active_presentation_request: undefined
    }]
}