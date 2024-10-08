import { Express, Request, Response } from 'express';
import { getPrivateKey } from './utils/keyManagement';
import { createCredential } from './utils/credentialCreation';

function routes(app: Express) {
    // This route is called by the issuer to create a credential.
    // For simplicity, it will just take some JSON of information and turn it into a credential
    app.post('/create/credential', async (req: Request, res: Response) => {
        const { information } = req.body;

        // Log the received information
        console.log('Received information:', information);

        const issuerPrivateKey = getPrivateKey();
        console.log('Issuer private key retrieved');

        try {
            const credential = createCredential(information, issuerPrivateKey);
            console.log('Credential created:', credential);

            res.status(201).json({
                message: 'Credential created successfully',
                credential: credential
            });
        } catch (error) {
            console.error('Error creating credential:', error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Failed to create credential',
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: 'Failed to create credential',
                    error: 'Unknown error'
                });
            }
        }
    });
}

export default routes;
