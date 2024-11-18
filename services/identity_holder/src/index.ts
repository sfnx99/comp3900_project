// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the identity_holder directory
$ npm i
$ npx ts-node src/index.ts 
*/

import { HttpStatusCode } from "axios";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { authLoginV2, authLogoutV2, authRegisterV2 } from "./auth";
import { deleteCredential, deleteCredentialV2, getCredential, getCredentials, getCredentialsV2, getCredentialV2 } from "./credentials";
import { getIssuers, getIssuersV2, getRequest, getRequestV2, makeRequest, makeRequestV2 } from './issuer';
import { getPresentation, getPresentationV2, makePresentation, postPresentationV2 } from './verifier';
import { wrapAuthorisation } from "./wrapper";
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8081;

// Parse request body
app.use(cors()); // Enable CORS for all routes
app.use(express.json())
let tokenStorage: string[] = [];

app.post('/v1/auth/register', (req: Request, res: Response) => {
    res.status(HttpStatusCode.PermanentRedirect).set("Location", "/v2/auth/register");
});

app.post('/v1/auth/login', (req: Request, res: Response) => {
    res.status(HttpStatusCode.PermanentRedirect).set("Location", "/v2/auth/login");
});

app.post('/v1/auth/logout', (req: Request, res: Response) => {
    res.status(HttpStatusCode.PermanentRedirect).set("Location", "/v2/auth/logout");
});

app.get('/v1/credentials', (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = getCredentials(token.slice(7));
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.get('/v1/credential', (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { id } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = getCredential(token.slice(7), id);
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.delete('/v1/credential', (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { id } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = deleteCredential(token.slice(7), id);
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.get('/v1/issuers', (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = getIssuers(token.slice(7));
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.get('/v1/credential/request', async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { issuer } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = await getRequest(token.slice(7), issuer)
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.post('/v1/credential/request', async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { issuer, format, access_code } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = await makeRequest(token.slice(7), issuer, format, access_code)
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.get("/v1/credential/present", async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { verifier } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = await getPresentation(token.slice(7), verifier);
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

app.post("/v1/credential/present", async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { verifier, format, id } = req.body;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = await makePresentation(token.slice(7), verifier, format, id);
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
});

// V2 Code:

// Authorization

// Check server is responsive
app.get("/hello", async (req: Request, res: Response) => {
    console.log("I (the server) am alive");
    res.status(200).send("Hello, world!"); // Send a response back to the client
});

app.post('/v2/auth/register', (req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(email)
    console.log(password)
    const result = authRegisterV2(email, password);
    res.status(result.status).json(result.body);
});

app.post('/v2/auth/login', (req: Request, res: Response) => {
    console.log("logging in")
    const {email, password} = req.body;
    const result = authLoginV2(email, password);
    res.status(result.status).json(result.body);
});

app.post('/v2/auth/logout', async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await wrapAuthorisation(token, authLogoutV2);
    res.status(result.status).json(result.body);
});

// Issuance

app.get("/v2/issuers", async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await wrapAuthorisation(token, getIssuersV2);
    res.status(result.status).json(result.body);
});

app.get("/v2/issue", async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    let issuer_id = req.query.issuer_id;
    if (typeof issuer_id !== "string") {
        issuer_id = ""
    }
    const result = await wrapAuthorisation(token, getRequestV2, issuer_id);
    res.status(result.status).json(result.body);
});

app.post("/v2/issue", async (req: Request, res: Response) => {
    console.log("In this route");
    const token = req.headers.authorization;
    const { issuer_id, auth_code, type, redirect_uri } = req.body;
    console.log(`Received request to issue credential: ${JSON.stringify({ issuer_id, auth_code, type, redirect_uri })}`);
    const result = await wrapAuthorisation(token, makeRequestV2, issuer_id, auth_code, type, redirect_uri);
    res.status(result.status).json(result.body);
})

// Presentation
app.get("/v2/present", async (req: Request, res: Response) => {
    console.log(`Received request for metadata`);
    const token = req.headers.authorization;
    let verifier_uri = req.query.verifier_uri;
    if (typeof verifier_uri !== "string") {
        verifier_uri = "";
    }
    const result = await wrapAuthorisation(token, getPresentationV2, verifier_uri);
    console.log(`Success: returning metadata: ${JSON.stringify(result.body)}`);
    res.status(result.status).json(result.body);
});

app.post("/v2/present", async (req: Request, res: Response) => {
    console.log(`Received request to make presentation`);
    const token = req.headers.authorization;
    const { verifier_uri, credential_id } = req.body;
    console.log(`Making presentation: verifier at ${verifier_uri}, with credential ${credential_id}`);
    const result = await wrapAuthorisation(token, postPresentationV2, verifier_uri, credential_id);
    console.log(`Success: presentation result: ${result.status}`);
    res.status(result.status).json(result.body);
});

// Management of Credentials
app.get("/v2/credentials", async (req: Request, res: Response) => {
    console.log("Retrieving all credentials")
    const token = req.headers.authorization;
    const result = await wrapAuthorisation(token, getCredentialsV2);
    res.status(result.status).json(result.body);
});

app.get("/v2/credential", async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    let credential_id = req.query.credential_id;
    if (typeof credential_id !== "string") {
        credential_id = "";
    }
    console.log(`Recieved request to view credential ${credential_id}`);
    const result = await wrapAuthorisation(token, getCredentialV2, credential_id);
    console.log(`Found credential: ${JSON.stringify(result.body)}`);
    res.status(result.status).json(result.body);
});

app.delete('/v2/credential', async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { credential_id } = req.body;
    const result = await wrapAuthorisation(token, deleteCredentialV2, credential_id);
    res.status(result.status).json(result.body);
});


app.listen(port, () => {
    console.log(`[server]: Identity_Holder Server is running at http://localhost:${port}`);
});

app.post('/v2/save-code', (req, res) => {
    const { token } = req.body;
    tokenStorage.push(token);
    res.status(200).json({ message: 'token saved successfully' });
});


app.post('/v2/get-code', (req, res) => {
    console.log("inside get token")
    const last = tokenStorage.length - 1;
    const token = tokenStorage[last];
    console.log("get token token", token)
    res.status(200).json({ token });
});
