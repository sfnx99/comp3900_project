// Test go here
// To be clear, the tests should never call any APIs.
// The tests should call the functions the APIs would usually call.
// So if '/app/explode' would call issuer_explode(), you should call issuer_explode() in the tests.
import { authRegister } from '../identity_holder/src/auth';
import { DEFAULT_DATA, setData } from '../identity_holder/src/data';
describe('test user registration V1', () => {
    beforeAll(() => {
        setData(DEFAULT_DATA)
    })

    test('Create Valid User', ()=> {
        const res = authRegister('john@email.com', 'password123'); //Using V1
        expect(res.status).toBe(200)
    })
})