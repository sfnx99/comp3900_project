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

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8083;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Service Provider is running at http://localhost:${port}`);
});

/*
Below is CLI, utilising Commander.js.
*/

const { Command } = require("commander");
const figlet = require("figlet");

const program = new Command();
console.log(figlet.textSync("Service Provider"));

program
    .version("1.0.0")
    .description("A CLI used for operating the Service Provider.")
    .option("-a --add-format [value]", "Add an acceptable credential format")
    .option("-f --remove-format [value]", "Remove an acceptable credential format")
    .option("-i --add-issuer [value]", "Add an entry to the list of trusted issuers")
    .option("-r --remove-issuer [value]", "Remove an entry from the list of trusted issuers")
    .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
