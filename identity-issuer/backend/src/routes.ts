import { Express, Request, Response } from 'express'
import { getPublicKey, getPrivateKey } from './utils/keyManagement';
import { createCredential } from './utils/credentialCreation'

function routes(app: Express) {
    // This route is called by the issuer to create a credential.
    // For simplicity for Demo A will just take some JSON of information and turn it into a credential
    app.post('/create/credential', async (req: Request, res: Response) => {
        const { information } = req.body
        const issuerPrivateKey = getPrivateKey()

        const credential = createCredential(information, issuerPrivateKey);

        res.status(201).json({
            message: 'Credential created successfully',
            credential: credential,
        })
    })

    // This route gets the issuer's did Document from its did Id and
    // is to be used by the Service Provider to retrieve the issuer's
    // did document
    app.get('/get/issuer/:did', async (req: Request, res: Response) => {
        // Not important for now
    })
}

export default routes
