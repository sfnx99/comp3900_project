// Tests all of the Verifier functions that don't depend on integration.

import { Data, Presentation } from "../identity_holder/src/interface"
import { PresentationDefinition } from "../service_provider/src/interface"
import { requestMetadata } from "../service_provider/src/request"

describe('Verifier V2: Requests', () => {
    beforeEach(() => {
    })

    test('Test v2/request works', async ()=> {
        const result = await requestMetadata();
        expect(result.status).toBe(200);
        expect(result.body.state).toBe("smurgle");
        expect(result.body.presentation_definition).toBe(TEST_PRESENTATION);
    })

    test('Test v2/request fails if presentationDefinitions are not present', async ()=> {
        const result = await requestMetadata();
        expect(result.status).toBe(500);
        expect(result.body.message).toBe('Internal Server Error');
    })
})

const TEST_PRESENTATION: PresentationDefinition = {
    "id": "wah00!",
    "input_descriptors": [
        {
            "id": "DriverLicenceCredential",
            "constraints": {
                "fields": [
                    {
                        "path": ["$.firstName"]
                    },
                    {
                        "path": ["$.lastName"]
                    }
                ]
            }
        }
    ]
}