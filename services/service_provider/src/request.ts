import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PresentationDefinition, ResponseV2 } from './interface';

export async function requestMetadata(): Promise<ResponseV2> {
    try {
        const presDesc = await readDefinitions();
        const session = uuidv4();
        console.log(presDesc.input_descriptors)
        console.log(presDesc.input_descriptors[0].constraints.fields)
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

export async function readDefinitions(): Promise<PresentationDefinition> {
    const val = await fs.promises.readFile("./presentationDefinitions.json");
    const jsonObject = JSON.parse(val.toString());
    console.log(jsonObject)
    return jsonObject;
    

}