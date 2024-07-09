export function requestMetadata() {
    fs.readFile("./metadata.json", (err: NodeJS.ErrnoException | null, data: Buffer) => {
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
            return {
                status: 200
                body: jsonObject
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