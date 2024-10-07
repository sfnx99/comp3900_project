import { Express, Request, Response } from 'express'

// Declaring the pre authorised code, which will contain a value
// when the credential offer route is called and will be used to
// compare the code provided by the user in the token request.
let preAuthCode = ''

function routes(app: Express) {
    // This route is called by the issuer to create a credential.
    // This body requires the credential id, the user's id and public key,
    // when the credential is issued and when its valid until
    // name of the configuration and the configuration fields in the body
    app.post('/create/credential', async (req: Request, res: Response) => {
        // const { userId, credentialId, userPublicKey, issuedAt, validUntil } =
        //     req.body

        // const issuerDid = await getCurrentIssuer()

        // if (!issuerDid) {
        //     throw new Error('No current issuer')
        // }

        // try {
        //     const credential = await createCredential(
        //         issuerDid.issuerDID,
        //         userId,
        //         credentialId,
        //         userPublicKey,
        //         issuedAt,
        //         validUntil
        //     )

        //     res.status(201).json({
        //         message: 'Credential created successfully',
        //         credential: credential,
        //     })
        // } catch (error) {
        //     logger.error(`Error creating credential: ${error}`)
        //     res.status(500).json({
        //         error: 'Internal Server Error',
        //     })
        // }
    })

    // This route gets the issuer's did Document from its did Id and
    // is to be used by the Service Provider to retrieve the issuer's
    // did document
    app.get('/get/issuer/:did', async (req: Request, res: Response) => {
        // const issuerDID = req.params.did

        // try {
        //     const issuer = await findIssuerByDID(issuerDID)

        //     if (!issuer) {
        //         return res.status(404).json({ error: 'Issuer not found' })
        //     }

        //     res.status(200).json(issuer.didDoc)
        // } catch (error) {
        //     logger.error('Error fetching issuer:', error)
        //     res.status(500).json({ error: 'Internal Server Error' })
        // }
    })
}

export default routes
