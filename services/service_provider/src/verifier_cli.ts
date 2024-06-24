/*
Below is CLI, utilising Commander.js.
*/

import * as fs from "fs";
import { Command } from "commander";
import figlet from "figlet";

const program = new Command();
console.log(figlet.textSync("Service Provider"));

program
    .version("1.0.1")
    .description("A CLI used for operating the Service Provider.")
    .option("-r --remove", "Remove an object when paired with a matching credential/issuer name")
    .option("-c --cred [value]", "Specify a credential to be added or removed from the metadata file.")
    .option("-i --issuer [value]", "Specify an issuer to be added or removed from the trusted issuers file.")
    .parse(process.argv);

const options = program.opts();

function add_metadata_to_file(new_entry: string, filepath: string, remove: string): void {
    fs.readFile(filepath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        const json_object = JSON.parse(data.toString());
        if (!Array.isArray(json_object.formats)) {
            json_object.formats = [];
        }

        // Add or remove the new object
	    if (!remove) {
            json_object.formats.push(new_entry);
            console.log("Added successfully.");
        } else {
            const index = json_object.formats.indexOf(new_entry.toString());

            if (index > -1) {
                json_object.formats.splice(index, 1);
                console.log("Removed successfully.");
            } else {
                console.error("Item not in list.");
                return;
            }
        }

        // Write the updated JSON object back to the file
        fs.writeFile(filepath, JSON.stringify(json_object, null, 2), 'utf8', (writeErr: NodeJS.ErrnoException | null) => {
            if (writeErr) {
                console.error("Could not write file:", writeErr);
                return;
            }
        });
    });
}

function add_issuer_to_file(new_entry: string, filepath: string, remove: string): void {
    fs.readFile(filepath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        const json_object = JSON.parse(data.toString());
        if (!Array.isArray(json_object.issuers)) {
            json_object.issuers = [];
        }

        // Add or remove the new object
	    if (!remove) {
            json_object.issuers.push(new_entry);
            console.log("Added successfully.");
        } else {
            console.log(new_entry)
            const index = json_object.issuers.indexOf(new_entry);

            if (index > -1) {
                json_object.issuers.splice(index, 1);
                console.log("Removed successfully.");
            } else {
                console.error("Item not in list.");
                return;
            }
        }

        // Write the updated JSON object back to the file
        fs.writeFile(filepath, JSON.stringify(json_object, null, 2), 'utf8', (writeErr: NodeJS.ErrnoException | null) => {
            if (writeErr) {
                console.error("Could not write file:", writeErr);
                return;
            }
        });
    });
}

// Check options provided in arguments and resolve them to corresponding commands.
if (options.cred) {
    add_metadata_to_file(options.cred, "./metadata.json", options.remove)
}

if (options.issuer) {
    add_issuer_to_file(options.issuer, "./trusted.json", options.remove)
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
