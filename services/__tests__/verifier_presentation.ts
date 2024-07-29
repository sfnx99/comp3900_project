// Tests all of the Verifier presentation functions that don't depend on integration.
import { presentSubmission } from "../service_provider/src/present"

describe('Verifier V2: Requests', () => {
    beforeEach(() => {
    })

    test('Test v2/present returns negative for Presentation Definition id not matching Presentation Submission', async ()=> {
        var TEST_SUBMISSION_MATCH_FAIL = TEST_SUBMISSION;
        TEST_SUBMISSION_MATCH_FAIL.presentation_submission.definition_id = "";
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_MATCH_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(500);
        expect(result.body.message).toBe("Incorrect presentation definition.");
    })

    test('Test v2/present returns negative for verifiable credential not matching acceptable credentials in Presentation Definition', async ()=> {
        var TEST_SUBMISSION_DID_FAIL = TEST_SUBMISSION;
        TEST_SUBMISSION_DID_FAIL.vp_token.verifiableCredential[0].type[0] = "";
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_DID_FAIL;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Provided verifiable credential does not match to a credential provided in the Presentation Definition.");
    })

    test('Test v2/present returns negative for not disclosing all required credentials', async ()=> {
        // var TEST_SUBMISSION_CRED_FAIL = TEST_SUBMISSION;
        // TEST_SUBMISSION_CRED_FAIL.vp_token.verifiableCredential[0].credentialSubject = {};
        // const { presentation_submission, vp_token, state } = TEST_SUBMISSION_CRED_FAIL;
        // const result = await presentSubmission(presentation_submission, vp_token, state);
        // expect(result.status).toBe(400);
        // expect(result.body.message).toBe("Not all required credentials disclosed.");
    })

    test('Test v2/present returns negative for proof that cannot be validated', async ()=> {
        var TEST_SUBMISSION_PROOF_FAIL = TEST_SUBMISSION;
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_PROOF_FAIL;
        TEST_SUBMISSION_PROOF_FAIL.vp_token.verifiableCredential[0].proof.proofValue = ["", ""];
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Proof unable to be validated. Credential denied.");
    })

    test('Test v2/present returns negative for untrusted issuer for credential / issuer cannot be resolved to DIDDoc', async ()=> {
        var TEST_SUBMISSION_TRUST_FAIL = TEST_SUBMISSION;
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION_TRUST_FAIL;
        TEST_SUBMISSION_TRUST_FAIL.vp_token.verifiableCredential[0].issuer = ""
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Failed to resolve DID to relevant DIDDoc.");
    })

    test('Test v2/present returns affirmative for proper submission', async ()=> {
        const { presentation_submission, vp_token, state } = TEST_SUBMISSION;
        const result = await presentSubmission(presentation_submission, vp_token, state);
        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Proof successfully recreated. Credential verified.");
    })
})

const TEST_SUBMISSION = {
    "presentation_submission": {
        "id": "25b44955-f67c-4059-b6f8-59bc01307df7",
        "definition_id": "2856b4d4-11a8-4eee-a0c4-084a23f2c1cd",
        "descriptor_map": [
            {
                "id": "DriverLicenceCredential",
                "format": "ldp_vc",
                "path": "$.verifiableCredential[0]",
            }
        ]
    },
    "vp_token": {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [
            {
                "@context": ["https://www.w3.org/ns/credentials/v2"],
                "id": "56041497-001f-4e58-8af1-0463b19f1831",
                "type": ["DriverLicenceCredential"],
                "issuer": "did:ion:EiDMDECBbDfWCNpMGpZiims2723ymKL-Kin8mlI9d78twQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJhRmp4U2FmWjlSbHBraFJfQTNONGFhX3ZPdFdETVM0b0dJdlpoeG1YVzljIiwieSI6Ii16TTdUbWxWLVdyeTA1Y2hoVmo5ZDY5dnVaeWh6OTVLMHJfMjdBNl9lQjQifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoidmMtZGF0YSIsInNlcnZpY2VFbmRwb2ludCI6eyJjcmVkZW50aWFsX2NvbmZpZ3VyYXRpb25zX3N1cHBvcnRlZCI6eyJEcml2ZXJMaWNlbmNlQ3JlZGVudGlhbCI6eyJmb3JtYXQiOiJsZHBfdmMifX0sImNyZWRlbnRpYWxfZW5kcG9pbnQiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6ODA4MiIsImtleSI6IlsxNjAsMjQxLDIyNiw5MSwyNDIsMTgxLDIyMSw2NCwxNzIsMTIzLDE5NSwyMTgsMjA5LDE5Miw4LDE4NywxNDgsMTEzLDIxMiwyNTUsMjA5LDY5LDE3Nyw5OSwyLDE3MywxMjksMTk2LDE3MCw0Niw1MiwzOCw1LDIyNywxNzIsMTI4LDEyOSwyNTQsNjMsMTg4LDE2MCwxNjEsMTUxLDE1NiwxMzgsMTU1LDQxLDE0Miw5LDEzMCwxNDcsMjUzLDE0MCw2MCwxNDAsMjI0LDE4MywzMiwxODYsMTc4LDI1LDE4OSwyNSwxNTgsMjIsMjQyLDYsNzgsMTI4LDIyMywyMjksMTA2LDE0Nyw5NywzOSwxODUsMTY1LDIyNywyNSwxMDAsMTYyLDExLDY4LDYzLDYxLDU3LDE3MCw3NCwxNTIsOSwzNiw0Nyw1NCwxMTIsMTczLDQyXSIsIm5hbWUiOiJOU1dHb3Zlcm5tZW50In0sInR5cGUiOiJ2Yy1kYXRhIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCRzJrbWcwYmRjZi02MUlqWWxwZUpnSFIwUFhrY1lOajh0MHBXaDRYMGRoUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHJ4SUYtUTRoTVlzODE0VEJmVW1mTFBTcm5IV2JkaF9aRG9NZXdLZTJNQnciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaURzSkFPOTZ5NEc5LXVzLVlVc0ExZlg4T3o4cEFUV3pNZG8tOWg5aDdBYVhRIn19",
                "credentialSubject": {
                    "firstName": "bob",
                    "lastName": "smith"
                },
                "proof": {
                    "type": "DataIntegrityProof",
                    "cryptosuite": "t11a-bookworms-bbs",
                    "verificationMethod": "did:ion:EiDMDECBbDfWCNpMGpZiims2723ymKL-Kin8mlI9d78twQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJhRmp4U2FmWjlSbHBraFJfQTNONGFhX3ZPdFdETVM0b0dJdlpoeG1YVzljIiwieSI6Ii16TTdUbWxWLVdyeTA1Y2hoVmo5ZDY5dnVaeWh6OTVLMHJfMjdBNl9lQjQifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoidmMtZGF0YSIsInNlcnZpY2VFbmRwb2ludCI6eyJjcmVkZW50aWFsX2NvbmZpZ3VyYXRpb25zX3N1cHBvcnRlZCI6eyJEcml2ZXJMaWNlbmNlQ3JlZGVudGlhbCI6eyJmb3JtYXQiOiJsZHBfdmMifX0sImNyZWRlbnRpYWxfZW5kcG9pbnQiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6ODA4MiIsImtleSI6IlsxNjAsMjQxLDIyNiw5MSwyNDIsMTgxLDIyMSw2NCwxNzIsMTIzLDE5NSwyMTgsMjA5LDE5Miw4LDE4NywxNDgsMTEzLDIxMiwyNTUsMjA5LDY5LDE3Nyw5OSwyLDE3MywxMjksMTk2LDE3MCw0Niw1MiwzOCw1LDIyNywxNzIsMTI4LDEyOSwyNTQsNjMsMTg4LDE2MCwxNjEsMTUxLDE1NiwxMzgsMTU1LDQxLDE0Miw5LDEzMCwxNDcsMjUzLDE0MCw2MCwxNDAsMjI0LDE4MywzMiwxODYsMTc4LDI1LDE4OSwyNSwxNTgsMjIsMjQyLDYsNzgsMTI4LDIyMywyMjksMTA2LDE0Nyw5NywzOSwxODUsMTY1LDIyNywyNSwxMDAsMTYyLDExLDY4LDYzLDYxLDU3LDE3MCw3NCwxNTIsOSwzNiw0Nyw1NCwxMTIsMTczLDQyXSIsIm5hbWUiOiJOU1dHb3Zlcm5tZW50In0sInR5cGUiOiJ2Yy1kYXRhIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCRzJrbWcwYmRjZi02MUlqWWxwZUpnSFIwUFhrY1lOajh0MHBXaDRYMGRoUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHJ4SUYtUTRoTVlzODE0VEJmVW1mTFBTcm5IV2JkaF9aRG9NZXdLZTJNQnciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaURzSkFPOTZ5NEc5LXVzLVlVc0ExZlg4T3o4cEFUV3pNZG8tOWg5aDdBYVhRIn19",
                    "proofPurpose": "assertionMethod",
                    "proofValue": ["[0,1,2,3]", "{\"0\":162,\"1\":139,\"2\":51,\"3\":22,\"4\":117,\"5\":197,\"6\":188,\"7\":24,\"8\":132,\"9\":45,\"10\":97,\"11\":55,\"12\":26,\"13\":214,\"14\":123,\"15\":155,\"16\":224,\"17\":59,\"18\":35,\"19\":149,\"20\":22,\"21\":177,\"22\":154,\"23\":11,\"24\":116,\"25\":98,\"26\":197,\"27\":181,\"28\":225,\"29\":98,\"30\":68,\"31\":117,\"32\":255,\"33\":106,\"34\":243,\"35\":197,\"36\":114,\"37\":79,\"38\":112,\"39\":164,\"40\":73,\"41\":212,\"42\":75,\"43\":22,\"44\":53,\"45\":192,\"46\":71,\"47\":132,\"48\":141,\"49\":12,\"50\":203,\"51\":32,\"52\":98,\"53\":22,\"54\":15,\"55\":216,\"56\":194,\"57\":177,\"58\":26,\"59\":216,\"60\":118,\"61\":149,\"62\":223,\"63\":18,\"64\":156,\"65\":97,\"66\":31,\"67\":114,\"68\":242,\"69\":32,\"70\":8,\"71\":101,\"72\":252,\"73\":126,\"74\":45,\"75\":39,\"76\":203,\"77\":229,\"78\":222,\"79\":121,\"80\":82,\"81\":105,\"82\":37,\"83\":74,\"84\":189,\"85\":244,\"86\":245,\"87\":69,\"88\":79,\"89\":231,\"90\":179,\"91\":149,\"92\":67,\"93\":132,\"94\":142,\"95\":87,\"96\":152,\"97\":177,\"98\":152,\"99\":61,\"100\":132,\"101\":114,\"102\":240,\"103\":148,\"104\":76,\"105\":95,\"106\":107,\"107\":188,\"108\":30,\"109\":226,\"110\":27,\"111\":160,\"112\":51,\"113\":79,\"114\":246,\"115\":23,\"116\":135,\"117\":216,\"118\":63,\"119\":14,\"120\":160,\"121\":120,\"122\":88,\"123\":211,\"124\":93,\"125\":3,\"126\":99,\"127\":216,\"128\":64,\"129\":4,\"130\":44,\"131\":159,\"132\":87,\"133\":202,\"134\":93,\"135\":223,\"136\":47,\"137\":168,\"138\":149,\"139\":137,\"140\":89,\"141\":86,\"142\":212,\"143\":68,\"144\":46,\"145\":211,\"146\":154,\"147\":21,\"148\":102,\"149\":184,\"150\":159,\"151\":38,\"152\":55,\"153\":53,\"154\":234,\"155\":32,\"156\":174,\"157\":100,\"158\":0,\"159\":87,\"160\":152,\"161\":149,\"162\":88,\"163\":171,\"164\":22,\"165\":92,\"166\":139,\"167\":246,\"168\":162,\"169\":59,\"170\":136,\"171\":116,\"172\":137,\"173\":205,\"174\":158,\"175\":144,\"176\":63,\"177\":205,\"178\":17,\"179\":35,\"180\":225,\"181\":217,\"182\":202,\"183\":48,\"184\":49,\"185\":82,\"186\":158,\"187\":68,\"188\":196,\"189\":35,\"190\":216,\"191\":218,\"192\":30,\"193\":131,\"194\":187,\"195\":135,\"196\":210,\"197\":250,\"198\":116,\"199\":95,\"200\":95,\"201\":39,\"202\":21,\"203\":189,\"204\":43,\"205\":224,\"206\":172,\"207\":101,\"208\":114,\"209\":110,\"210\":99,\"211\":122,\"212\":235,\"213\":154,\"214\":25,\"215\":207,\"216\":198,\"217\":159,\"218\":141,\"219\":121,\"220\":145,\"221\":17,\"222\":245,\"223\":100,\"224\":59,\"225\":128,\"226\":57,\"227\":6,\"228\":3,\"229\":165,\"230\":20,\"231\":128,\"232\":229,\"233\":192,\"234\":124,\"235\":178,\"236\":56,\"237\":157,\"238\":114,\"239\":11,\"240\":107,\"241\":147,\"242\":106,\"243\":85,\"244\":201,\"245\":44,\"246\":166,\"247\":3,\"248\":179,\"249\":6,\"250\":101,\"251\":196,\"252\":62,\"253\":246,\"254\":200,\"255\":19,\"256\":247,\"257\":102,\"258\":146,\"259\":37,\"260\":113,\"261\":13,\"262\":234,\"263\":61,\"264\":6,\"265\":175,\"266\":217,\"267\":106,\"268\":168,\"269\":212,\"270\":103,\"271\":18}"]
                }
            }
        ]
    },
    "state": "oeih1129"
}