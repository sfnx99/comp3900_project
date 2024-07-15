// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the issuer directory
$ npm i
$ npx ts-node src/index.ts 
*/

import { DID, generateKeyPair } from '@decentralized-identity/ion-tools';
import * as bbs from '@digitalbazaar/bbs-signatures';
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { authenticate, authorize, token } from "./oauth.js";
// import { input } from '@inquirer/prompts';
import { Command } from 'commander';
import { getCredential, getCredentials, getFormats, setFormats } from "./db.js";
import { Format } from "./types.js";

const program = new Command();

program.requiredOption('-f, --formats <formats>');

program.parse();

const options = program.opts();
const formats: Format[] = JSON.parse(fs.readFileSync(options.formats, { encoding: 'utf8', flag: 'r' })).formats;
setFormats(formats);

const metadata_formats: { [key:string] : { "format": "ldp_vc" } }= {};
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
let secretKey = new Uint8Array();
let publicKey = new Uint8Array();

app.use(express.json());
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.json({ did_uri, bbs_public_key: publicKey});
});

app.get("/v2/authorize", (req: Request, res: Response) => { res.sendFile(path.join(__dirname, 'authorize.html')) });

app.post("/v2/authorize", (req: Request, res: Response) => {
    const { client_id, client_secret, redirect_uri, state, scope } = req.body;
    res.redirect(authorize(client_id, client_secret, redirect_uri, state, scope));
})

app.post("/v2/token", (req: Request, res: Response) => {
    const { code, client_id } = req.body;
    res.json({ access_token: token(client_id, code), token_type: 'bearer' })
});

app.post("/v2/credential", async (req: Request, res: Response) => {
    try {
        const access_token = req.headers.authorization!.slice(7);
        res.json(await issue(access_token));
    } catch (e) {
        res.sendStatus(403);
    }
});

app.get("/debug/formats", (req: Request, res: Response) => {
    res.json(getFormats());
});

app.get("/debug/credentials", (req: Request, res: Response) => {
    res.json(getCredentials());
});




app.listen(port, async () => {
    console.log("Issuer Started on localhost:8082");
    const keyPair = await bbs.generateKeyPair({
        ciphersuite: 'BLS12-381-SHA-256'
    });
    secretKey = keyPair.secretKey;
    publicKey = keyPair.publicKey;

    const authKeys = await generateKeyPair();
    const did = new DID({
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
                        "credential_endpoint": "http://localhost:8082",
                        "credential_configurations_supported": metadata_formats,
                    }
                }
            ]
        }
    });

    did_uri = await did.getURI();

    // This isn't working on docker
    // console.log('Enter credentials of the form <client_id>;<credentialType>;<fields>');
    // while (true) {
    //     const answer = await input({ message: '' });
    //     try {
    //         let split_input = answer.split(';');
    //         addCredential(split_input[0], split_input[1], JSON.parse(split_input[2]));
    //     } catch (e) {
    //         console.error("\nError: Could not parse data. Please try again.")
    //     }
    // }
    console.log(did_uri);

});

async function issue(access_token: string) {
    console.log(`Issuing with access_token: ${access_token}`)
    const request = authenticate(access_token);
    console.log(request)
    const credential = getCredential(request.client_id, request.scope);
    console.log(credential)
    if (credential === undefined) {
        throw new Error("Credential Does not exist");
    }
    
    // const credential: Credential = {client_id: "bob@test.com", format: "DriverLicenceCredential", fields: {"firstName":"bob", "lastName":"smith", "licenseNo":"234955",  "expiryDate": "10/2025", "dob": "1/1/2000"}}
    
    const header = new Uint8Array();
    const messages = Object.entries(credential.fields).map((e) => new TextEncoder().encode(JSON.stringify(e)));
    console.log(messages)
    const signature: Uint8Array = await bbs.sign({secretKey, publicKey, header, messages, ciphersuite: 'BLS12-381-SHA-256'});
    console.log(signature, signature.toString())
    return {
        credential: {
            "@context": [
                "https://www.w3.org/ns/credentials/v2"
            ],
            "type": [credential.format],
            "issuer": did_uri,
            "credentialSubject": credential.fields,
            "proof": {
                "type": "DataIntegrityProof",
                "cryptosuite": "t11a-bookworms-bbs",
                "verificationMethod": did_uri,
                "proofPurpose": "assertionMethod",
                "proofValue": signature.toString(),
            }
        }
    }
}