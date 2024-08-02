import { v4 as uuidv4 } from 'uuid';
import { ResponseV2 } from './interface';
import { getDefinition } from './db';


/*
    This function is used by the request endpoint to provide a structured
    response to the identity_holder of a formatted presentation_definition
    with a stored session id.
*/
export async function requestMetadata(): Promise<ResponseV2> {
    try {
        const presDesc = getDefinition();
        const session = uuidv4();
        return {
            status: 200,
            body: {
                presentation_definition: {
                    "id": session,
                    "input_descriptors": presDesc.input_descriptors
                },
                "state": "smurgle"
            }
        }
    } catch (parseErr) {
        return {
            status: 500,
            body: {
                message: 'Internal Server Error',
                error: parseErr
            }
        }
    }
}