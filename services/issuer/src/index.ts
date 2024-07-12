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
import { authorize } from "./authorize";
import { issue } from "./issue";
// @ts-ignore
import { anchor, DID, generateKeyPair } from '@decentralized-identity/ion-tools';
// import * as bbs from '@digitalbazaar/bbs-signatures';
// import { Command } from 'commander';
// @ts-ignore
import ExpressOAuthServer from '@node-oauth/express-oauth-server';
import { model } from "./model";

// const program = new Command();

// program.requiredOption()

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8082;

const oauth = new ExpressOAuthServer({
    model: model,
});

let did_uri = '';

app.get("/", (req: Request, res: Response) => {
    res.json({ did_uri });
});

app.get("/v2/authorize", oauth.authorize(), (req: Request, res: Response) => {
    res.send("secret");
});

app.post("/v2/token", oauth.authenticate(), (req: Request, res: Response) => {
});

app.post("/v2/credential", oauth.token(), (req: Request, res: Response) => {
});

app.post("/v2/credential", oauth.token(), (req: Request, res: Response) => {
});


app.listen(port, async () => {
    console.log(`[server]: Issuer Server is running at http://localhost:${port}`);
    let authKeys = await generateKeyPair();
    let did = new DID({
        content: {
            publicKeys: [
                {
                    id: 'key-1',
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    publicKeyJwk: authKeys.publicJwk,
                    purposes: [ 'authentication' ]
                }
            ],
            services: [
                {
                    id: 'bbs-key-1',
                    type: 'BBSKey',
                    serviceEndpoint: {
                        "credential_endpoint": "localhost:8082",
                        "credential_configurations_supported": {
                            // import these from the cli
                            "DriverLicenceCredential": {
                                "format": "ldp_vc"
                            },
                            "PhotoCardCredential": {
                                "format": "ldp_vc"
                            }
                        }
                    }
                }
            ]
        }
    });

    did_uri = await did.getURI();
});