import { v4 as uuidv4 } from 'uuid';
import { PresentationDefinition, ResponseV2 } from './interface';
import * as fs from 'fs';

export function requestMetadata(): ResponseV2 {
    try {
        const presDesc = readDefinitions().input_descriptors;
        const session = uuidv4();

        return {
            status: 200,
            body: {
                "id": session,
                "input_descriptors": presDesc
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

export function readDefinitions(): PresentationDefinition {
    fs.readFile("./presentationDefinitions.json", (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            return {
                status: 500,
                body: {
                    message: 'Internal Server Error',
                    error: err
                }
            }
        }

        const jsonObject = JSON.parse(data.toString());
        return jsonObject;
    });

    throw new Error("Uh oh!!!! Whoopsie!!!!");
}