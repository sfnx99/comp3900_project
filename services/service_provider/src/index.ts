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
const fs = require("fs");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8083;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Service Provider is running at http://localhost:${port}`);
});

app.post("/v1/metadata", (req: Request, res: Response) => {
    fs.readFile("./metadata.json", 'utf8', (err: Error, data: any) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        try {
            let jsonObject = JSON.parse(data);
            res.status(200).json(jsonObject);
        } catch (parseErr) {
            res.status(500).json({ message: 'Internal Server Error', error: parseErr });;
        }
    });
});

app.post("/v1/receive", (req: Request, res: Response) => {
    const data = req.body;
    let jsonObject = JSON.parse(data);

    fs.readFile("./trusted.json", 'utf8', (err: Error, data: any) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        try {
            let trusted = JSON.parse(data);
            const issuer = jsonObject.iss;
            if (trusted.list.findIndex((item: { iss: string; }) => item.iss === issuer)) {
                res.status(200).json({ message: 'Credential Accepted.' });
            } else {
                res.status(403).json({ message: 'Credential Denied.' });
            }
        } catch (parseErr) {
            res.status(500).json({ message: 'Internal Server Error: ', error: parseErr });;
        }
    });
});

let metadata = JSON.parse("./metadata.json");
console.log(metadata)

