import express from 'express'
import config from '../config/default'
import routes from './routes'

const port = config['port']

const app = express()
app.use(express.json())

// Backend Servers Creation
routes(app)
// Important to note: This server is A holder not mulitple.
const server = app.listen(port, async () => {
    console.log(`Identity Holder Backend is running at http://localhost:${port}`)
})

export { app, server }
