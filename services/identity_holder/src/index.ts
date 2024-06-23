// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the identity_holder directory
$ npm i
$ npx ts-node src/index.ts 
*/

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { addOne } from "./extra";
import { authRegister, authLogin, authLogout } from "./auth";
import {getCredentials, getCredential, deleteCredential} from "./credentials";
import {getIssuers, getRequest, makeRequest} from './issuer';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8081;

// Parse request body
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server : 2+1=" + addOne(2));
});

app.post('/v1/auth/register', (req: Request, res: Response) => {
    const {email, password} = req.body;
    const result = authRegister(email, password);
    res.status(result.status).json(result.body);
});

app.post('/v1/auth/login', (req: Request, res: Response) => {
    const {email, password} = req.body;
    const result = authLogin(email, password);
    res.status(result.status).json(result.body);
});

app.post('/v1/auth/logout', (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (token !== undefined) {
        // Cut off "Bearer "{token}
        const result = authLogout(token.slice(7));
        res.status(result.status).json(result.body);
    } else {
        res.status(401).json({error: "User is not logged in"});
    }
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

app.listen(port, () => {
    console.log(`[server]: Identity_Holder Server is running at http://localhost:${port}`);
});
