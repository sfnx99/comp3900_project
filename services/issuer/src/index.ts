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

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8082;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Issuer Server is running at http://localhost:${port}`);
});