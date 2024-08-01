import { addUser, editUser, getCredential, getFormats, getUser, setFormats } from '../issuer/src/db'
import { authenticate, authorize, token } from '../issuer/src/oauth';


describe('Issuer agent tests', () => {
    // Testing credential adding and removing
    test('Test adding a user', ()=> {
        addUser('test1@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        expect(getUser('test1@test.com')).toEqual({ client_id: 'test1@test.com', info : {'firstName': 'Tony', 'lastName': 'Black'}});
    })

    test('Test getting a user\'s client id wrong', ()=> {
        addUser('test2@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        expect(() => getUser('wrong@test.com')).toThrow();
    })

    test('Test editing a user\'s information', ()=> {
        addUser('test3@test.com', {});
        editUser('test3@test.com', {'firstName': 'Tony', 'lastName': 'Black'})
        expect(getUser('test3@test.com')).toEqual({ client_id: 'test3@test.com', info : {'firstName': 'Tony', 'lastName': 'Black'}});
    })

    test('Test creating formats', ()=> {
        setFormats([{id: 'DriverLicence', fields: ['firstName', 'lastName', 'licenceNo']}]);
        expect(getFormats()).toEqual([{id: 'DriverLicence', fields: ['firstName', 'lastName', 'licenceNo']}]);
    })

    test('Test getting a credential', ()=> {
        setFormats([{id: 'TestCard', fields: ['firstName', 'lastName']}]);
        addUser('test5@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        expect(getCredential('test5@test.com', 'TestCard')).toEqual({client_id: 'test5@test.com', format: 'TestCard', fields: {'firstName': 'Tony', 'lastName': 'Black'}});
    })

    test('Test getting a credential with invalid format', ()=> {
        setFormats([{id: 'TestCard', fields: ['firstName', 'lastName']}]);
        addUser('test6@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        expect(() => getCredential('test6@test.com', 'WrongCard')).toThrow();
    })

    test('Test getting a credential a user cannot get', ()=> {
        setFormats([{id: 'TestCard', fields: ['firstName', 'lastName', 'boatLicenceNo']}]);
        addUser('test6@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        expect(() => getCredential('test6@test.com', 'TestCard')).toThrow();
    })

    // Testing the oauth flow

    test('Test the full oauth flow', ()=> {
        setFormats([{id: 'TestCard', fields: ['firstName', 'lastName']}]);
        addUser('test6@test.com', {'firstName': 'Tony', 'lastName': 'Black'});
        const {code, state} = authorize('test6@test.com', 'password', 'https://redirect.com', 'abc', 'TestCard');
        expect(state).toEqual('abc');
        const tok = token('test6@test.com', code);
        expect(authenticate(tok)).toEqual({client_id: 'test6@test.com', scope: 'TestCard'})
    })
})