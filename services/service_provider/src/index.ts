#! /usr/bin/env node
// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the service_provider directory
$ npm i
$ npx ts-node src/index.ts hi
*/

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { presentSubmission } from "./present";
import { requestMetadata } from "./request";

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

app.get("/v2/request", async (req: Request, res: Response) => {
    const result = await requestMetadata();
    res.status(result.status).json(result.body);
});

app.post("/v2/present", async (req: Request, res: Response) => {
    console.log("Received presentation");
    const { presentation_submission, vp_token, state } = req.body;
    const result = await presentSubmission(presentation_submission, vp_token, state);
    console.log(`Presentation processed: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.body);
});

