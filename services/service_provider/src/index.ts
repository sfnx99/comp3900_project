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

//import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { presentSubmission } from "./present";
import { requestMetadata } from "./request";
import { initialiseDefinition, getPresentations, modifyDefinition, logPresentation, trust, untrust } from "./db";

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8083;

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    initialiseDefinition();
    console.log(`[server]: Service Provider is running at http://localhost:${port}`);
});

app.get("/v2/request", async (req: Request, res: Response) => {
    const result = await requestMetadata();
    res.status(result.status).json(result.body);
});

app.post("/v2/present", async (req: Request, res: Response) => {
    const { presentation_submission, vp_token, state } = req.body;
    console.log(presentation_submission, vp_token, state);
    const result = await presentSubmission(presentation_submission, vp_token, state);
    logPresentation({
        issuer: vp_token.verifiableCredential[0].issuer,
        type: vp_token.verifiableCredential[0].type[0],
        cryptosuite: vp_token.verifiableCredential[0].proof.cryptosuite,
        credential: vp_token.verifiableCredential[0].credentialSubject,
        status: result.status === 200 ? "accepted" : "denied"
    });
    res.status(result.status).json(result.body);
});

// frontend endpoints

app.get('/v2/presentations', (req: Request, res: Response) => {
    res.status(200).json(getPresentations());
});

app.post('/v2/trust', (req: Request, res: Response) => {
    const { id } = req.body;
    trust(id);
    res.sendStatus(200);
});

app.post('/v2/untrust', (req: Request, res: Response) => {
    const { id } = req.body;
    untrust(id);
    res.sendStatus(200);
});

app.post('/v2/definition', (req: Request, res: Response) => {
    const { type, requiredAttributes } = req.body;
    const attr: string[] = requiredAttributes;
    modifyDefinition({
        id: 'wah00!',
        input_descriptors: [
            {
                id: type,
                constraints: {
                    fields: attr.map(e => {return {path: [`$.${e}`]}})
                }
            }
        ]
    });
    res.sendStatus(200);
});