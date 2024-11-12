// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)

/*
TO RUN:
Install node.js, then restart your computer
cd into the issuer directory
$ npm i
$ npx ts-node src/index.ts 
*/
// @ts-expect-error  bad import
import { DID, resolve } from '@decentralized-identity/ion-tools';
// @ts-expect-error bad import
import * as bbs from '@digitalbazaar/bbs-signatures';
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import { authenticate, authorize, token } from "./oauth.js";
import { getCredential, logCredential, getCredentials, setFormats, addIssuerAdmin, addCredentialLog, getCredentialLogs } from "./db.js";
import { authenticateIssuerAdmin, authorizeIssuerAdmin } from './oauth.js';
import { registerUser, modifyUser, modifyFormat, registerIssuer } from "./frontend.js"
import { readFile, writeFile } from 'fs/promises';
require('dotenv').config() // eslint-disable-line
import fs from "fs";
import http from "http";
import https from "https";
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_RENEG_WINDOW } from 'tls';
let authCodeStorage: string[] = [];

const privateKey  = fs.readFileSync('key.pem', 'utf8'); // Hardcoded
const certificate = fs.readFileSync('cert.pem', 'utf8'); // Hardcoded

const opt = {
    key: privateKey,
    cert: certificate,
};

dotenv.config();

const app: Express = express();
//const port = process.env.PORT || 8082;

// const oauth = new ExpressOAuthServer({
//     model: model,
// });

let did_uri = '';
let secretKey = new Uint8Array();
let publicKey = new Uint8Array();

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    console.error(`Served DID at /: ${did_uri}`);
    res.json({ did_uri });
});

// app.get("/v2/authorize", (req: Request, res: Response) => { res.sendFile(path.join(__dirname, 'authorize.html')) });

app.post("/v2/admin/login", (req: Request, res: Response) => {
    try {
        const { admin_id, admin_secret, did_url} = req.body;

        // Check if all required parameters are present
        if (!admin_id || !admin_secret) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Authorize admin using the provided DID URL
        const token = authorizeIssuerAdmin(admin_id, admin_secret, did_url);
        return res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: (err instanceof Error ? err.message : 'Internal Server Error')
        });
    }
});


// frontend endpoints

app.post("/v2/admin/register", (req: Request, res: Response) => {
    console.log(`Register issuer admin ${req.body.email} with password ${req.body.password}`);
    try {
        const { email, password } = req.body;
        addIssuerAdmin(email, { admin_secret: password });
        console.log(`Successfully registered`);
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(`Failed to register`, err);
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: String(err) });
        }
    }
});

app.get("/v2/credentials", (req: Request, res: Response) => {
    try {
        res.status(200).json(getCredentials());
    } catch(err) {
        res.status(500).json(err);
    }
});


app.get("/v2/list-credentials", (req: Request, res: Response) => {
    try {
        const credentials = getCredentials().map(credential => ({
            credentialName: credential.format, // Use nameOfCredential for the credential name
            ...credential
        }));
        res.status(200).json(credentials);
    } catch(err) {
        res.status(500).json(err);
    }
});

app.get("/v2/view-credential-by-name/:name", (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const credential = getCredentials().find(credential => credential.format === name);
      if (!credential) {
        return res.status(404).json({ error: 'Credential not found' });
      }
      res.status(200).json(credential);
    } catch (err) {
      res.status(500).json({ error: (err instanceof Error ? err.message : 'Internal Server Error') });
    }
  });




app.post("/v2/authorize", (req: Request, res: Response) => {
    try {
        const { application, client_id, client_secret, redirect_uri, state, scope } = req.body;
        console.log('Received request body:', req.body);

        const credential = getCredential(application.client_id, application.credentialType);
        if (!credential) {
            console.error('Credential not found for application:', application);
            return res.status(404).json({ error: 'Credential not found' });
        }

        addCredentialLog({
            client_id: application.client_id,
            type: application.credentialType,
            cryptosuite: 't11a-bookworms-bbs',
            credential: credential.fields,
        });

        const authResponse = authorize(client_id, client_secret, redirect_uri, state, scope);
        res.json(authResponse);
    } catch (err) {
        console.error('Error in /v2/authorize endpoint:', err);
        res.status(500).json({
            error: (err instanceof Error ? err.message : 'Internal Server Error')
        });
    }
});

app.post("/v2/register", (req: Request, res: Response) => {
    console.log(`Register user ${req.body.email} with password ${req.body.password}`);
    try {
        const { email, password } = req.body;
        registerUser(email, password);
        console.log(`Successfully registered`);
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(`Failed to register`, err);
        if (err instanceof Error) {
            res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
        } else {
            res.status(500).json({ error: String(err) });
        }
    }
});

app.post("/v2/authorize/client", (req: Request, res: Response) => {
    try {
        const { client_id, client_secret, redirect_uri, state, scope } = req.body;
        console.log(`Authorize client: ${client_id} to receive credential type ${scope}`);
        res.json(authorize(client_id, client_secret, redirect_uri, state, scope));
    } catch(err) {
        res.status(500).json({
            error: JSON.stringify(err)
        });
    }
})

// access token created by owner auth code 
app.post("/v2/token", (req: Request, res: Response) => {
    const { code, client_id } = req.body;
    res.json({ access_token: token(client_id, code), token_type: 'bearer' })
});

app.post("/v2/credential", async (req: Request, res: Response) => {
    try {
        const access_token = req.headers.authorization!.slice(7);
        console.log(`Received request to issue credential with token ${access_token}`);
        res.json(await issue(access_token));
    } catch (e) {
        res.status(500).json(e);
    }
});

app.post("/v2/name", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        console.log(`Recieved request to change name to ${name}`);
        await updateName(name);
        res.sendStatus(200);
    } catch(err) {
        res.status(500).json(err);
    }
});

app.get("/v2/credential-logs", (req: Request, res: Response) => {
    try {
        const logs = getCredentialLogs();
        res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: (err instanceof Error ? err.message : 'Internal Server Error')
        });
    }
});

app.post('/v2/save-code', (req, res) => {
    const { auth_code } = req.body;
    authCodeStorage.push(auth_code);
    res.status(200).json({ message: 'Auth code saved successfully' });
  });
  
  // Route to get the auth code
  app.post('/v2/get-code', (req, res) => {
    const auth_code = authCodeStorage[0];
    res.status(200).json({ auth_code });
  });


app.post("/v2/info", (req: Request, res: Response) => {
    console.log(`Add information ${JSON.stringify(req.body.info)} for user ${req.body.email}`);
    try {
        const { email, info } = req.body;
        modifyUser(email, info);
        console.log(`Successfully added information`);
        res.sendStatus(200);
    } catch (err) {
        console.log(`Failed to add information`);
        res.status(500).json(err);
    }
});

app.post("/v2/format", async (req: Request, res: Response) => {
    try {
        const { type, attributes } = req.body;
        console.log("Changing format to be of type");
        console.log(type);
        console.log("Changing attributes to be");
        console.log(attributes);
        modifyFormat(type, attributes);
        await updateFormat(type);
        res.sendStatus(200);
    } catch(err) {
        res.status(500).json(err);
    }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(opt, app);
httpServer.listen(8082, () => console.log("Issuer Started on port 8082"));
httpsServer.listen(8443, async () => {
    console.log("HTTPS issuer Started on localhost:8443");
    await initialise_did();
    publicKey = new Uint8Array(JSON.parse(process.env.BBS_PUBLICKEY!));
    secretKey = new Uint8Array(JSON.parse(process.env.BBS_PRIVATEKEY!));
});

async function issue(access_token: string) {
    console.log(`Authenticating token ${access_token}...`);
    const request = authenticate(access_token);
    console.log(`Successfully authenticated`);
    console.log(`Obtaining credential...`);
    const credential = getCredential(request.client_id, request.scope);
    console.log(`Obtained credential: ${JSON.stringify(credential)}`);
    if (credential === undefined) {
        throw new Error("Credential Does not exist");
    }
    
    // const credential: Credential = {client_id: "bob@test.com", format: "DriverLicenceCredential", fields: {"firstName":"bob", "lastName":"smith", "licenseNo":"234955",  "expiryDate": "10/2025", "dob": "1/1/2000"}}
    
    const header = new Uint8Array();
    // first
    const firstChunk = JSON.stringify({
        "@context": [
            "https://www.w3.org/ns/credentials/v2"
        ],
        "type": [credential.format],
        "issuer": did_uri,
    });
    // last
    const lastChunk = JSON.stringify({
            "type": "DataIntegrityProof",
            "cryptosuite": "t11a-bookworms-bbs",
            "verificationMethod": did_uri,
            "proofPurpose": "assertionMethod",
    });
    // convert middle to kvp
    const key_value_pairs = Object.entries(credential.fields);
    const result = []
    for (let index = 0; index < key_value_pairs.length; index++) {
        const kvp = key_value_pairs[index]
        const key = kvp[0]
        if (key === "id") {
            // Dont allow Verifier to inspect did.
            continue
        }
        result.push({
            index: index + 1, // BBS is zero-indexed, and index 0 is the header of the payload. Thus, credentialSubject is 1-indexed.
            key: key,
            value: kvp[1]
        })
    }
    // convert middle to chunks

    const middleChunks = result
        .map(cs => indexed_key_value_pairs_to_object([cs]))
        .map(obj => JSON.stringify(obj));
    const messages = [firstChunk, ...middleChunks, lastChunk].map(c => new TextEncoder().encode(c));
    const signature: Uint8Array = await bbs.sign({secretKey, publicKey, header, messages, ciphersuite: 'BLS12-381-SHA-256'});
    logCredential({client_id: request.client_id, type: credential.format, cryptosuite: 't11a-bookworms-bbs', credential: credential.fields});
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


function indexed_key_value_pairs_to_object(kvp_list: {index: number,key: string,value: string}[]) {
    // const result = kvp_list.reduce((acc, val) => acc[val.key] = val.value, Object())
    const result = Object();
    for (const {key, value} of kvp_list) {
        result[key] = value;
    }
    return result;
}

async function initialise_did() {

    publicKey = JSON.parse(process.env.DID_PUBLICKEY!);

    // Read in config
    const did_config = JSON.parse(await readFile('./did.json', { encoding: 'utf8' }));
    // Update formats
    setFormats([{id: Object.keys(did_config.data.credential_configurations_supported)[0], fields: ["firstName", "lastName"]}]);
    // Load in current DID document
    const did = await resolve(did_config.uri);
    const did_data = did.didDocument.service[0].serviceEndpoint;
    // Check if we need to update
    let updateNeeded = false;
    for (const key of Object.keys(did_config.data)) {
        if (JSON.stringify(did_config.data[key]) !== JSON.stringify(did_data[key])) {
            console.error(`Needs update: ${JSON.stringify(did_config.data[key])} != ${JSON.stringify(did_data[key])}`)
            updateNeeded = true;
        }
    }
    // Update (if needed)
    if (updateNeeded) {
        console.error("Alert: generating new DID")
        const new_did_data = Object();
        new_did_data.key = process.env.BBS_PUBLICKEY;
        for (const key of Object.keys(did_config.data)) {
            new_did_data[key] = did_config.data[key];
        }
        const new_did = new DID({
            content: {
                publicKeys: [{
                    id: 'key-1',
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    publicKeyJwk: JSON.parse(process.env.DID_PUBLICKEY!),
                    purposes: [ 'authentication' ]
                }],
                services: [
                    {
                        id: 'vc-data',
                        type: 'vc-data',
                        serviceEndpoint: new_did_data
                    }
                ]
            }
        });
        const new_did_uri = await new_did.getURI();
        did_config.uri = new_did_uri;
        // Update config file
        await writeFile('./did.json', JSON.stringify(did_config));
    }
    did_uri = did_config.uri;
    console.log(`Current DID document at ${did_config.uri}`);
}

async function updateFormat(format: string) {
    const did_config = JSON.parse(await readFile('./did.json', { encoding: 'utf8' }));
    
    // Load in current DID document
    const did = await resolve(did_uri);
    const did_data = did.didDocument.service[0].serviceEndpoint;

    // Update
    const new_did_data = Object();
    for (const key of Object.keys(did_data)) {
        new_did_data[key] = did_data[key];
    }
    new_did_data.credential_configurations_supported = Object();
    new_did_data.credential_configurations_supported[format] = {format: "ldp-vc"};
    const new_did = new DID({
        content: {
            publicKeys: [{
                id: 'key-1',
                type: 'EcdsaSecp256k1VerificationKey2019',
                publicKeyJwk: JSON.parse(process.env.DID_PUBLICKEY!),
                purposes: [ 'authentication' ]
            }],
            services: [
                {
                    id: 'vc-data',
                    type: 'vc-data',
                    serviceEndpoint: new_did_data
                }
            ]
        }
    });
    const new_did_uri = await new_did.getURI();
    did_config.uri = new_did_uri;
    // Update config file
    await writeFile('./did.json', JSON.stringify(did_config));
    did_uri = new_did_uri;
    console.log(`Current DID document at ${did_config.uri}`);
}


async function updateName(name: string) {
    const did_config = JSON.parse(await readFile('./did.json', { encoding: 'utf8' }));
    
    // Load in current DID document
    const did = await resolve(did_uri);
    const did_data = did.didDocument.service[0].serviceEndpoint;

    // Update
    const new_did_data = Object();
    for (const key of Object.keys(did_data)) {
        new_did_data[key] = did_data[key];
    }
    new_did_data.name = name;
    const new_did = new DID({
        content: {
            publicKeys: [{
                id: 'key-1',
                type: 'EcdsaSecp256k1VerificationKey2019',
                publicKeyJwk: JSON.parse(process.env.DID_PUBLICKEY!),
                purposes: [ 'authentication' ]
            }],
            services: [
                {
                    id: 'vc-data',
                    type: 'vc-data',
                    serviceEndpoint: new_did_data
                }
            ]
        }
    });
    const new_did_uri = await new_did.getURI();
    did_config.uri = new_did_uri;
    // Update config file
    await writeFile('./did.json', JSON.stringify(did_config));
    did_uri = new_did_uri;
    console.log(`Current DID document at ${did_config.uri}`);
}
