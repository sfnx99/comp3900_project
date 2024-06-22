/*
Below is CLI, utilising Commander.js.
*/

import * as fs from "fs";
import { Command } from "commander";
import figlet from "figlet";

const program = new Command();
console.log(figlet.textSync("Service Provider"));

program
    .version("1.0.0")
    .description("A CLI used for operating the Service Provider.")
    .option("-a --add", "Add an object when paired with a matching credential/issuer")
    .option("-r --remove", "Remove an object when paired with a matching issuer name")
    .option("-c --cred [value]", "Specify a credential to be added or removed from the metadata file.")
    .option("-i --trust [value]", "Specify an issuer to be added or removed from the trusted issuers file.")
    .parse(process.argv);

const options = program.opts();

function add_json_object_to_file(new_object: string, filepath: string, style: string): void {
    fs.readFile(filepath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        const jsonObject = JSON.parse(data.toString());

        // try {
        //     jsonObject = JSON.parse(data.toString());
        // } catch (parseErr) {
        //     console.error("Could not parse JSON:", parseErr);
        //     return;
        // }

        if (!Array.isArray(jsonObject.list)) {
            jsonObject.list = [];
        }

        // Add or remove the new object
	    if (style === "add") {
            const new_json_object = JSON.parse(new_object);
            jsonObject.list.push(new_json_object);
            console.log("JSON object added successfully.");
        } else if (style === "remove") {
            const index = jsonObject.list.findIndex((item: { iss: string; }) => item.iss === new_object);

            if (index > -1) {
                jsonObject.list.splice(index, 1);
                console.log("JSON object removed successfully.");
            } else {
                console.error("Object not in list.");
                return;
            }
        }

        // Write the updated JSON object back to the file
        fs.writeFile(filepath, JSON.stringify(jsonObject, null, 2), 'utf8', (writeErr: NodeJS.ErrnoException | null) => {
            if (writeErr) {
                console.error("Could not write file:", writeErr);
                return;
            }
        });
    });
}

// Check options provided in arguments and resolve them to corresponding commands.
if (options.cred) {
    if ((!options.add && !options.remove) || (options.add && options.remove)) {
        console.log("Add and remove arguments input incorrectly");
    } else {
	const style = options.add === true ? "add" : "remove"
        add_json_object_to_file(options.cred, "./metadata.json", style)
    }
}

if (options.trust) {
    if ((!options.add && !options.remove) || (options.add && options.remove)) {
        console.log("Add and remove arguments input incorrectly");
    } else {
        const style = options.add === true ? "add" : "remove"
        add_json_object_to_file(options.trust, "trusted.json", style)
    }
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
