#!/usr/bin/env node

const { program } = require("commander");
const path = require("path");
const inquirer = require('inquirer');
const chalk = require("chalk");
const fs = require("fs");

const promt = inquirer.createPromptModule();

program
    .version("1.0.0")
    .description("Configuration files creator.")

program
    .command("create <name>")
    .option("--extension <value>", "File extension")
    .alias("c")
    .description("Create new configuration file.")
    .action((name, cmd) => {
       if (cmd.extension && !["json", "txt", "cfg"].includes(cmd.extension)) {
           console.log(chalk.red("Extension in not allowed."))
       } else {
           promt([
               {
                   type: 'input',
                   name: 'charset',
                   message: 'Charset: ',
               },
               {
                   type: 'input',
                   name: 'max_ram_usage',
                   message: 'Max RAM usage, Mb: ',
               },
               {
                   type: 'input',
                   name: 'max_cpu_usage',
                   message: 'Max CPU usage, %: ',
               },
               {
                   type: 'input',
                   name: 'check_updates_interval',
                   message: 'Updates interval, ms: ',
               },
               {
                   type: 'input',
                   name: 'processes_count',
                   message: 'Processes count: ',
               },
           ]).then((options) => {
               if (cmd.extension && cmd.extension === "json") {
                   fs.writeFileSync(path.resolve(__dirname, `${name}.${cmd.extension}`), JSON.stringify(options))
               } else {
                   let data = '';
                   for (let item in options) {
                       data += `${item}=${options[item]} \n`;

                       fs.writeFileSync(path.resolve(__dirname, `${name}.${cmd.extension}`), data);
                   }
               }

               console.log(chalk.green(`File "${name}.${cmd.extension || 'cfg'}" created.`))
           })
       }
    })

program
    .command("all")
    .alias("a")
    .description("Show all configuration files.")
    .action(() => {
        const files = fs.readdirSync(path.resolve(__dirname, "./"));

        let data = "";
        for (let file of files) data += `${file} \n`;

        console.log(chalk.green(`Configuration files: ${data}`));
    })

program.parse(process.argv);