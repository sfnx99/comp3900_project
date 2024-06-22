// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the issuer directory
$ npm i
$ npx ts-node src/index.ts 
*/

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { metadata } from "./metadata";
import { authorize } from "./authorize";
import { issue } from "./issue";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8082;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/v1/metadata", (req: Request, res: Response) => {
    res.json(metadata());
});

app.get("/v1/authorize", (req: Request, res: Response) => {
    const email = req.query.email as string;
    const password = req.query.password as string;
    res.json(authorize(email, password));
});

app.get("/v1/credential/issue", (req: Request, res: Response) => {
    const access_token = req.get('access_token') as string;
    res.json(issue(access_token));
});

app.listen(port, () => {
    console.log(`[server]: Issuer Server is running at http://localhost:${port}`);
});