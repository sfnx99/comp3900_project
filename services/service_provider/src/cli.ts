/*
Below is CLI, utilising Commander.js.
*/

const { writeFileSync } = require("fs");
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

// Functionality of commands contained within below functions.

function add_format() {
    
}

function remove_format() {

}

function add_issuer() {

}

function remove_issuer() {

}

// Check options provided in arguments and resolve them to corresponding commands.

if (options.add-format) {
    const format = typeof options.add-format === "object"
    add_format(format)
}

if (options.remove-format) {
    remove_format(options.remove-format)
}

if (options.add-issuer) {
    add_issuer(options.add-issuer)
}

if (options.remove-issuer) {
    remove_issuer(options.remove-issuer)
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
