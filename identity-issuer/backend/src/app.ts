import express from 'express'
import config from 'config'
import routes from './routes'
import {
    generateIssuerKeys
} from './utils/keyManagement'

const port = config.get<number>('port')

const app = express()
app.use(express.json())

// Backend Servers Creation
routes(app)
// Important to note: This server is AN issuer not mulitple.
const server = app.listen(port, async () => {
    generateIssuerKeys()
    console.log(`Identity Issuer Backend is running at http://localhost:${port}`)
})

export { app, server }
