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

app.listen(port, () => {
    console.log(`[server]: Identity_Holder Server is running at http://localhost:${port}`);
});
