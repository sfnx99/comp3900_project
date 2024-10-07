import express from 'express'
import config from 'config'
import routes from './routes'

const port = config.get<number>('port')

const app = express()
app.use(express.json())

routes(app)

const server = app.listen(port, async () => {
    console.log(`Identity Issuer Backend is running at http://localhost:${port}`)
})

export { app, server }
