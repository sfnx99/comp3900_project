import express from 'express'
import config from '../config/default'
import routes from './routes'
import {
    generateIssuerKeys
} from './utils/keyManagement'

const port = config['port']

const app = express()
app.use(express.json())

// Backend Servers Creation
routes(app)
// Important to note: This server is AN issuer not mulitple.
const server = app.listen(port, async () => {
    await generateIssuerKeys()
    console.log(`Identity Issuer Backend is running at http://localhost:${port}`)
})

export { app, server }
