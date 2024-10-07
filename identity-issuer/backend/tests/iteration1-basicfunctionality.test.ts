// Tests for creating credential configurations for issuers
// The database is cleared before each test and
// after each test the server is closed
import request from 'supertest'
import { app, server } from '../src/app'

// Calls the '/create/credential-configuration' route
describe('POST /create/credential', () => {
    it('Returns a dummy credential', async () => {
        const requestBody = {
            information: {
                name: "Josh",
                address: "101 cool kids avenue"
            }
        }

        const response = await request(app)
            .post('/create/credential')
            .send(requestBody)
            .expect(201)

        expect(response.body).toHaveProperty(
            'message',
            'Credential created successfully'
        )

        expect(response.body).toHaveProperty('credential')
        const credential = response.body.credential
        expect(credential).toHaveProperty(
            'information',
            {
                name: 'Josh',
                address: '101 cool kids avenue'
            }
        )
        expect(credential).toHaveProperty(
            'signature',
            expect.any(Number)
        )
    })

    afterAll(async () => {
        server.close()
    })
})