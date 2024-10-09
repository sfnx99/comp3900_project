import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto'; // For generating unique IDs
import QRCode from 'qrcode'; // For generating QR codes
//import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());

// In-memory session store for simplicity (use a database in production)
const sessions: { [key: string]: string } = {};

// Middleware to parse JSON body
app.use(express.json());

// Route to generate and return a QR session URL
app.post('/generate-session', (req: Request, res: Response) => {
    const sessionId = randomUUID();
    sessions[sessionId] = 'waiting';

    // Send the session URL back to the client
    res.json({ url: `http://localhost:${port}/connect/${sessionId}` });
});

// Endpoint to get QR code image
app.get('/qr/:data', async (req: Request, res: Response) => {
    const data = req.params.data;

    try {
        // Generate QR code and return as PNG
        const qrCodeImage = await QRCode.toBuffer(data);
        res.type('png');
        res.send(qrCodeImage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code');
    }
});

// Other routes...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
