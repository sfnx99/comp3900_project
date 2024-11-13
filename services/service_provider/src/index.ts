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
import cors from 'cors';
import axios from 'axios';
import config from "./config.json";

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8083;
// Express backend setup

app.use(cors()); // Enable CORS for all routes
app.use(express.json())

app.post('/initialize', async (req, res) => {
    const { issuer_did, verifier_url } = req.body;
    console.log('Received request with body:', req.body);

    try {
        console.log('Sending trust request...');
        const trustResponse = await axios.post(`${verifier_url}/v2/trust`, {
            id: issuer_did
        });
        console.log('Issuer trusted successfully:', trustResponse.status);
        res.status(200).send('Issuer trusted successfully');
    } catch (error) {
        console.error('Error trusting issuer:', error);
        return res.status(500).send('Failed to trust issuer');
    }
});

app.post('/define', async (req, res) => {
    const { verifier_url } = req.body;
        console.log('Received request with body:', req.body);
    try {
        console.log('Sending definition request...');
        const definitionResponse = await axios.post(verifier_url + '/v2/definition', {
            type: config.licenseType,
            requiredAttributes: config.requiredAttributes
        });
        console.log('Service Provider Defined Fields successfully:', definitionResponse.status);
        res.status(200).send('Service Provider Defined Fields successfully');
    } catch (error) {
        console.error('Error defining fields:', error);
        return res.status(500).send('Failed to define service provider fields');
    }
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, async () => {
    await initialiseDefinition();
    console.log(`[server]: Service Provider is running at http://localhost:${port}`);
});

app.get("/v2/request", async (req: Request, res: Response) => {
    console.log(`Received metadata request`);
    const result = await requestMetadata();
    console.log(`Success: providing metadata: ${JSON.stringify(result.body)}`);
    return res.status(result.status).json(result.body);
});

app.post("/v2/present", async (req: Request, res: Response) => {
    console.log(`Received presentation`);
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
    console.log(`Success: presentation result: ${result.status}`);
    res.status(result.status).json(result.body);
});

// frontend endpoints

app.get('/v2/presentations', (req: Request, res: Response) => {
    res.status(200).json(getPresentations());
});

app.post('/v2/trust', (req: Request, res: Response) => {
    console.error(`Received request to trust issuer: ${req.body.id}`);
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
    console.log(`Update definition: require ${req.body.type} with attributes ${req.body.requiredAttributes}`);
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
    console.log(`Successfully updated`);
    res.sendStatus(200);
});