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
import { hello } from "./extra";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8081;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server" + hello());
});

app.listen(port, () => {
    console.log(`[server]: Identity_Holder Server is running at http://localhost:${port}`);
});



// See ../tests/presentation.ts for this
export function addOne(number: number): number {
    return number + 1
}