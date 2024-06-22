/*
Below is CLI, utilising Commander.js.
*/

import { StringifyOptions } from "querystring";

const fs = require("fs");
const { Command } = require("commander");
const figlet = require("figlet");

const program = new Command();
console.log(figlet.textSync("Service Provider"));

program
    .version("1.0.0")
    .description("A CLI used for operating the Service Provider.")
    .option("-a --add", "Add an object when paired with a matching credential/issuer")
    .option("-r --remove", "Remove an object when paired with a matching credential/issuer")
    .option("-c --cred [value]", "Specify a credential to be added or removed from the metadata file.")
    .option("-i --trust [value]", "Specify an issuer to be added or removed from the trusted issuers file.")
    .parse(process.argv);

const options = program.opts();

function add_json_object_to_file(new_object: string, filepath: string, style: string): void {
    fs.readFile(filepath, 'utf8', (err: Error, data: any) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        let jsonObject;
        try {
            jsonObject = JSON.parse(data);
        } catch (parseErr) {
            console.error("Could not parse JSON:", parseErr);
            return;
        }

        // Ensure the jsonObject has a list of objects
        if (!Array.isArray(jsonObject.list)) {
            jsonObject.list = [];
        }

        // Add or remove the new object
	    if (style === "add") {
            let new_json_object = JSON.parse(new_object);
            jsonObject.list.push(new_json_object);
        } else if (style === "remove") {
            let new_json_object = JSON.parse(new_object);
            const index = jsonObject.list.indexOf(new_json_object);
            console.log(new_json_object)
            if (index > -1) {
                jsonObject.list.splice(index, 1);
            } else {
                console.error("Object not in list.");
                return;
            }
        }

        // Write the updated JSON object back to the file
        fs.writeFile(filepath, JSON.stringify(jsonObject, null, 2), 'utf8', (writeErr: Error) => {
            if (writeErr) {
                console.error("Could not write file:", writeErr);
                return;
            }
            console.log("JSON object added successfully.");
        });
    });
}

function format(format: string, style: string): void {
    try {
        add_json_object_to_file(format, "./metadata.json", style)
    } catch (error) {
        console.error(error);
    }
}

function issuer(issuer: string, style: string): void {
    try {
        add_json_object_to_file(issuer, "trusted.json", style)
    } catch (error) {
        console.error(error);
    }
}

// Check options provided in arguments and resolve them to corresponding commands.

if (options.cred) {
    if ((!options.add && !options.remove) || (options.add && options.remove)) {
        console.log("Add and remove arguments input incorrectly");
    } else {
	const style = options.add === true ? "add" : "remove"
        format(options.cred, style)
    }
}

if (options.trust) {
    if ((!options.add && !options.remove) || (options.add && options.remove)) {
        console.log("Add and remove arguments input incorrectly");
    } else {
        const style = options.add === true ? "add" : "remove"
        issuer(options.cred, style)
    }
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
