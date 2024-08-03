// Tests all of the Verifier request functions that don't depend on integration.

import { requestMetadata } from "../service_provider/src/request";

describe('Verifier V2: Requests', () => {
    beforeEach(() => {
    })

    test('Test v2/request works', async ()=> {
        const result = await requestMetadata();
        expect(result.status).toBe(200);
        expect(result.body.state).toBe("smurgle");
        expect(result.body.presentation_definition.input_descriptors).toStrictEqual(TEST_PRESENTATION);
    })


    /*
        Failure is untestable in a non-integrated environment, as the presentation definition is found
        and created locally. As such, at one time tests can only check for it either existing or not.
        This test can and will pass if the relevant JSON is deleted.
    /*
    test('Test v2/request fails if presentationDefinitions are unreadable', async ()=> {
        const result = await requestMetadata();
        expect(result.status).toBe(500);
        expect(result.body.message).toBe('Internal Server Error');
    })
    */
})

const TEST_PRESENTATION = [
    {
        "constraints": {
            "fields": [
                {
                    "path": ["$.firstName"]
                },
                {
                    "path": ["$.lastName"]
                }
            ]
        },
        "id": "DriverLicenceCredential"
    }
]