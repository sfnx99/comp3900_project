import express from 'express';
import config from './default';
import routes from './routes';
import { generateIssuerKeys } from './utils/keyManagement';

const port = config.port;

const app = express();
app.use(express.json());

// Backend Servers Creation
routes(app);
var router = express.Router()
app.use('/', router)
app.use(express.json())

// Important to note: This server is AN issuer not multiple.
const server = app.listen(port, async () => {
    await generateIssuerKeys();
    console.log(`Identity Issuer Backend is running at http://192.168.1.100:3000`);
});

export { app, server };

