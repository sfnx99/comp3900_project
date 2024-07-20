// none of this is working, go to oauth.ts to see a pseudo oauth system.

import { Client, User, Token, AuthorizationCode, Falsey } from '@node-oauth/oauth2-server'

const tokens: Map<string, Token> = new Map();
const authCodes: Map<string, AuthorizationCode> = new Map();
const clients: Client[] = [{clientId: 'test@test.com', id: 'test@test.com', grants: ['authorization_code'], redirectUris: 'localhost:8082'}];

export const model = {
    getAuthorizationCode: function(authorizationCode: string): Promise<AuthorizationCode | Falsey> {
        return Promise.resolve(authCodes.get(authorizationCode));
    },

    getClient: function(clientId: string, /*clientSecret: string*/): Promise<Client | Falsey> {
        return Promise.resolve(clients.find((client) => client.id === clientId));
    },

    saveToken: function(token: Token, client: Client, user: User): Promise<Token | Falsey> {
        token.client = client;
        token.user = user;
        tokens.set(token.accessToken, token);
        return Promise.resolve(token);
    },

    saveAuthorizationCode: function(
        code: Pick<AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope' | 'codeChallenge' | 'codeChallengeMethod'>,
        client: Client,
        user: User
    ): Promise<AuthorizationCode | Falsey> {
        const auth_code = code as AuthorizationCode;
        auth_code.client = client;
        auth_code.user = user;
        authCodes.set(auth_code.authorizationCode, auth_code);
        return Promise.resolve(auth_code);
    },

    revokeAuthorizationCode: function(code: AuthorizationCode): Promise<boolean> {
        return Promise.resolve(authCodes.delete(code.authorizationCode));
    },
    // validateScope: function(user: User, client: Client, scope?: string[]): Promise<string[] | Falsey> {

    // },

    verifyScope: function(/*token: Token, requestedScopes: string[]*/): Promise<boolean> {
        // let token = tokens.get(accessToken);
        // if (token === undefined || token.) {
        //     return Promise.resolve(false);
        // }
        return Promise.resolve(true);
    },

    getAccessToken: function(accessToken: string): Promise<Token | Falsey> {
        return Promise.resolve(tokens.get(accessToken))
    }
}
