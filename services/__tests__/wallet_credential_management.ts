import { deleteCredentialV2, getCredentialsV2, getCredentialV2 } from "../identity_holder/src/credentials"
import { getData, setData } from "../identity_holder/src/data"
import { Data, User } from "../identity_holder/src/interface"
import { wrapAuthorisation } from "../identity_holder/src/wrapper"

describe('Wallet V2: Management of Credentials', () => {
    beforeEach(() => {
        setData(JSON.parse(JSON.stringify(TEST_DATA)))
    })

    test('Test v2/credentials works', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const all_credentials: string[] = getCredentialsV2(user1_session).body.credentials
        const expected_credentials = ["a07903b3-77be-482c-a3ca-a7cfec2a23ba", "e8b08949-8369-48d2-9d6f-2a1c2f1d52ec"]
        all_credentials.sort()    
        expected_credentials.sort()
        expect(all_credentials).toStrictEqual(expected_credentials)
    })

    test('Test v2/credentials fails for invalid user', async ()=> {
        const res = await wrapAuthorisation('invalidusertoken', getCredentialsV2) // getCredentialsV2 will never be called for a false user with wrapAuthorisation.
        expect(res.status).toBeGreaterThanOrEqual(400)
    })

    test('Test v2/credential works', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const credential1 = "e8b08949-8369-48d2-9d6f-2a1c2f1d52ec"
        const credential = getCredentialV2(user1_session, credential1).body
        expect(credential).toStrictEqual({
            "issuer": "did:exampleissuer:12345",
            "type": ["VerifiableCredential", "CredentialType1"],
            "cryptosuite": "t11a-bookworms-bbs",
            "credential": {
                "id": "e8b08949-8369-48d2-9d6f-2a1c2f1d52ec", // This should be the users DID??
                "firstName": "John",
                "lastName": "Smith"
            }
        })
    })

    test('Test v2/credential works for second test credential', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const credential2 = "a07903b3-77be-482c-a3ca-a7cfec2a23ba"
        const credential = getCredentialV2(user1_session, credential2).body
        expect(credential).toStrictEqual({
            "issuer": "did:exampleissuer2:67890",
            "type": ["VerifiableCredential", "CredentialType2"],
            "cryptosuite": "t11a-bookworms-bbs",
            "credential": {
                "id": "a07903b3-77be-482c-a3ca-a7cfec2a23ba", // This should be the users DID??
                "firstName": "John",
                "middleName": "Alison",
                "lastName": "Smith"
            }
        })
    })

    test('Test v2/credential fails for invalid credential id', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const credential1 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        expect(getCredentialV2(user1_session, credential1).status).toBe(400)
    })

    test('Test v2/credential can delete credential', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const credential1 = "e8b08949-8369-48d2-9d6f-2a1c2f1d52ec"
        expect(getCredentialV2(user1_session, credential1).status).toBe(200)
        expect(getCredentialsV2(user1_session).body.credentials.length).toBe(2)
        expect(deleteCredentialV2(user1_session, credential1).status).toBe(200)
        expect(getCredentialV2(user1_session, credential1).status).toBe(400)
        expect(getCredentialsV2(user1_session).body.credentials.length).toBe(1)
    })

    test('Test v2/credential fails to delete invalid credential', ()=> {
        const data = getData()
        const user1_session = data.sessions[0]
        const credential1 = "aaaaaaaaaaaaaaaaaaaaaa"
        expect(getCredentialsV2(user1_session).body.credentials.length).toBe(2) // For some reason state isnt being reset between the tests. Going with it for now.
        expect(deleteCredentialV2(user1_session, credential1).status).toBe(400)
        expect(getCredentialsV2(user1_session).body.credentials.length).toBe(2)
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
        "http://localhost:8082" // hardcoded
    ],
    sessions: [{
        session_id: "aaaaa-aaaa-aaaaaa-aaaaa",
        user: TEST_USER_1,
        active_presentation_request: undefined
    }]
}