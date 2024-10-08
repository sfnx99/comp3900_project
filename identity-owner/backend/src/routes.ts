import { Express, Request, Response } from 'express'
import { generateQR } from './utils/qr'

function routes(app: Express) {
    // This route is called by the holder to generate a QR code.
    app.post('/create/qr', async (req: Request, res: Response) => {
        const { information } = req.body
        const qrCode = generateQR(information)

        res.status(201).json({
            message: 'QR generated',
            qr: qrCode
        })
    })
}

export default routes
