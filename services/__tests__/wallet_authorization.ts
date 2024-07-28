// Tests all of the Wallet functions that don't depend on integration.

import { authLoginV2, authRegisterV2 } from "../identity_holder/src/auth"
import { getData, setData } from "../identity_holder/src/data"
import { Data, User } from "../identity_holder/src/interface"

describe('Wallet V2: Authorization', () => {
    beforeEach(() => {
        setData(JSON.parse(JSON.stringify(TEST_DATA)))
    })

    test('Test v2/auth/register', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        expect(authRegisterV2("jim@email.com.au", "password1234").status).toBe(200)
        expect(data.users.length).toBe(prevUsers + 1)
    })

    test('Test v2/auth/register disallow email reuse', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        expect(authRegisterV2("jim@email.com.au", "password1234").status).toBe(200)
        expect(authRegisterV2("jim@email.com.au", "password1234").status).toBe(400)
        expect(data.users.length).toBe(prevUsers + 1) // Only the first jim should have been created
    })

    test('Test v2/auth/register disallow null email', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        expect(authRegisterV2("", "password1234").status).toBe(400)
        expect(data.users.length).toBe(prevUsers) // No user should have been created
    })

    test('Test v2/auth/register disallow null password', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        expect(authRegisterV2("jim@email.com.au", "").status).toBe(400)
        expect(data.users.length).toBe(prevUsers) // No user should have been created
    })

    test('Test v2/auth/register allows password reuse between two accounts', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        expect(authRegisterV2("jim@email.com.au", "hello").status).toBe(200)
        expect(authRegisterV2("john@email.com.au", "hello").status).toBe(200)
        expect(data.users.length).toBe(prevUsers + 2)
    })

    test('Test v2/auth/register returns something on success', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        const token = authRegisterV2("jim@email.com.au", "hello").body.token
        expect(token).toBeDefined()
        expect(data.users.length).toBe(prevUsers + 1)
    })

    test('Test v2/auth/register returns a token that is associated with a session', ()=> {
        const data = getData()
        const prevUsers = data.users.length
        const token = authRegisterV2("jim@email.com.au", "hello").body.token
        expect(data.sessions.find(s => s.session_id === token)).toBeDefined()
        expect(data.users.length).toBe(prevUsers + 1)
    })

    test('Test v2/auth/login works', ()=> {
        const email = "jim@email.com.au"
        const password = "hello"
        authRegisterV2(email, password)
        expect(authLoginV2(email, password).status).toBe(200)
    })

    test('Test v2/auth/login returns a token that is associated with a session', ()=> {
        const data = getData()
        const email = "jim@email.com.au"
        const password = "hella"
        authRegisterV2(email, password)
        const token = authLoginV2(email, password).body.token
        expect(data.sessions.find(s => s.session_id === token)).toBeDefined()
    })

    test('Test v2/auth/login fails on invalid password', ()=> {
        const email = "jim@email.com.au"
        authRegisterV2(email, "valid password")
        expect(authLoginV2(email, "INCORRECT password").status).toBeGreaterThanOrEqual(400)
    })

    test('Test v2/auth/login fails on invalid email', ()=> {
        authRegisterV2("jim@email.com.au", "valid password")
        expect(authLoginV2("INVALIDjim@email.com.au", "valid password").status).toBeGreaterThanOrEqual(400)
    })

    test('Test v2/auth/login fails on empty email and password', ()=> {
        authRegisterV2("jim@email.com.au", "valid password")
        expect(authLoginV2("", "").status).toBeGreaterThanOrEqual(400)
    })
})

const TEST_USER_1: User = {
    email: "user1@email.com",
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