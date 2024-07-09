#! /usr/bin/env node
// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the service_provider directory
$ npm i
$ npx ts-node src/index.ts
*/

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { requestMetadata } from "./request";
import { presentSubmission } from "./present";


import * as fs from "fs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8083;

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Service Provider is running at http://localhost:${port}`);
});

app.post("/v2/request", (req: Request, res: Response) => {
    const result = requestMetadata();
    res.status(result.status).json(result.body);
});

app.post("/v2/present", (req: Request, res: Response) => {
    const { pres_def, state } = req.body;
    const result = presentSubmission(pres_def, state);
    res.status(result.status).json(result.body);
});

