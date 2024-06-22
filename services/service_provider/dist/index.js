#! /usr/bin/env node
"use strict";
// Basic Webserver. Change as you see fit.
// The CI/CD pipeline will build from this file (src/index.ts)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
TO RUN:
Install node.js, then restart your computer
cd into the service_provider directory
$ npm i
$ npx ts-node src/index.ts
*/
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8083;
app.get("/", (req, res) => {
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
