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
import path from "path";
import fs from "fs";
import cors from "cors";
import { authenticate, authorize, token } from "./oauth";
// @ts-ignore
import { anchor, DID, generateKeyPair } from '@decentralized-identity/ion-tools';
// @ts-ignore
import { bbs } from '@digitalbazaar/bbs-signatures';
import { Command } from 'commander';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { addCredential, getCredential, getCredentials, getFormats, setFormats } from "./db";
import { Format, Credential } from "./types";

const program = new Command();

program.requiredOption('-f, --formats <formats>');

program.parse();

const options = program.opts();
const formats: Format[] = JSON.parse(fs.readFileSync(options.formats, { encoding: 'utf8', flag: 'r' })).formats;
setFormats(formats);

let metadata_formats: { [key:string] : any }= {};
for (const format of formats) {
    metadata_formats[format.id] = { "format": "ldp_vc" };
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8082;

// const oauth = new ExpressOAuthServer({
//     model: model,
// });

let did_uri = '';
let secretKey: any;
let publicKey: any;

app.use(express.json());
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.json({ did_uri });
});

app.get("/v2/authorize", (req: Request, res: Response) => { res.sendFile(path.join(__dirname, 'authorize.html')) });

app.post("/v2/authorize", (req: Request, res: Response) => {
    const { client_id, client_secret, redirect_uri, state, scope } = req.body;
    res.redirect(authorize(client_id, client_secret, redirect_uri, state, scope));
})

app.post("/v2/token", (req: Request, res: Response) => {
    const { grant_type, code, redirect_uri, client_id } = req.body;
    res.json({ access_token: token(client_id, code), token_type: 'bearer' })
});

app.post("/v2/credential", async (req: Request, res: Response) => {
    const access_token = req.get('access_token') as string;
    res.json(await issue(access_token));
});

app.get("/debug/formats", (req: Request, res: Response) => {
    res.json(getFormats());
});

app.get("/debug/credentials", (req: Request, res: Response) => {
    res.json(getCredentials());
});




app.listen(port, async () => {
    const {bbs_secretKey, bbs_publicKey} = await bbs.generateKeyPair({
        ciphersuite: 'BLS12-381-SHA-256'
    });
    secretKey = bbs_secretKey;
    publicKey = bbs_publicKey;

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
                    publicKey: publicKey,
                    serviceEndpoint: {
                        "credential_endpoint": "localhost:8082",
                        "credential_configurations_supported": metadata_formats,
                    }
                }
            ]
        }
    });

    did_uri = await did.getURI();

    console.log('Enter credentials of the form <client_id>;<credentialType>;<fields>');
    const rl = readline.createInterface({ input, output });

    rl.on('line', (input) => {
        try {
            let split_input = input.split(';');
            addCredential(split_input[0], split_input[1], JSON.parse(split_input[2]));
        } catch (e) {
            console.error("\nError: Could not parse data. Please try again.")
        }
    }); 
});

async function issue(access_token: string) {
    // let request = authenticate(access_token);
    // const credential = getCredential(request.client_id, request.scope);
    // if (credential === undefined) {
    //     throw new Error("Credential Does not exist");
    // }
    
    const credential: Credential = {client_id: "bob@test.com", format: "DriverLicenceCredential", fields: {"firstName":"bob", "lastName":"smith", "licenseNo":"234955",  "expiryDate": "10/2025", "dob": "1/1/2000"}}
    
    const header = new Uint8Array();
    const messages = Object.entries(credential.fields).map((e) => new TextEncoder().encode(JSON.stringify(e)));
    const signature = await bbs.sign({secretKey, publicKey, header, messages, ciphersuite: 'BLS12-381-SHA-256'});

    return {
        "@context": [
            "https://www.w3.org/ns/credentials/v2"
        ],
        "type": [credential.format],
        "issuer": did_uri,
        "credentialSubject": credential.fields,
        "proof": {
            "type": "DataIntegrityProof",
            "cryptosuite": "t11a-bookworms-bbs",
            "verificationMethod": "https://issuer.com/bbs-publickey.json",
            "proofPurpose": "assertionMethod",
            "proofValue": signature,
        }
    }
}