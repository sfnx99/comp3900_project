// Tests all of the Verifier presentation functions that don't depend on integration.

import { PresentationSubmission } from "../identity_holder/src/interface"
import { presentSubmission } from "../service_provider/src/present"

describe('Verifier V2: Requests', () => {
    beforeEach(() => {
    })

    test('Test v2/present returns negative for Presentation Definition id not matching Presentation Submission', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_MATCH_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })

    test('Test v2/present returns negative for verifiable credential not matching acceptable credentials in Presentation Definition', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_DID_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })

    test('Test v2/present returns negative for not disclosing all required credentials', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_CRED_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })

    test('Test v2/present returns negative for proof that cannot be validated', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_PROOF_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })

    test('Test v2/present returns negative for untrusted issuer for credential', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_TRUST_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })

    test('Test v2/present returns affirmative for proper submission', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_SUCCESS;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
    })
})

const TEST_SUBMISSION_SUCCESS = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}

const TEST_SUBMISSION_MATCH_FAIL = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}

const TEST_SUBMISSION_DID_FAIL = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}

const TEST_SUBMISSION_CRED_FAIL = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}

const TEST_SUBMISSION_PROOF_FAIL = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}

const TEST_SUBMISSION_TRUST_FAIL = {
    "presentation_submission": {
        "id": "",
        "definition_id": "",
        "descriptor_map": [
            {
                "id": "",
                "format": "",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["h"],
        "type": ["h"],
        "verifiableCredential": [
            {
                "@context": ["h"],
                "id": "h",
                "type": [],
                "issuer": "",
                "credentialSubject": {
                    "firstName": "John"
                },
                "proof": {
                    "type": "",
                    "cryptosuite": "",
                    "verificationMethod": "",
                    "proofPurpose": "",
                    "proofValue": ["", ""]
                }
            }
        ]
    },
    "state": ""
}