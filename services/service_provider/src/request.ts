import { v4 as uuidv4 } from 'uuid';

export function requestMetadata(): PresentationDefinition {
    fs.readFile("./presentationDefinitions.json", (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            return {
                status: 500
                body: { 
                    message: 'Internal Server Error', 
                    error: parseErr 
                }
            }
        }

        try {
            const jsonObject = JSON.parse(data.toString());
            const session = uuidv4();
            return {
                status: 200
                body: {
                    "id": session,
                    "input_descriptors": jsonObject[0]
                }
            }
        } catch (parseErr) {
            return {
                status: 500
                body: { 
                    message: 'Internal Server Error', 
                    error: parseErr 
                }
            }
        }
    });
}