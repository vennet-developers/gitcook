#!/usr/bin/env node --no-warnings=ExperimentalWarning
process.removeAllListeners("warning");

import updateNotifier from "update-notifier";
import chalk from "chalk";

import { Command } from "commander";
import figlet from "figlet";
import * as emoji from "node-emoji";
import inquirer from "inquirer";

import pkg from "../package.json" assert { type: "json" };

const program = new Command();

const questions: object = [
  {
    name: "finalpath",
    type: "input",
    message: "Enter path where you want to add the project react:",
    default: process.cwd(),
    validate: (value: string) => {
      if (value.length) {
        return true;
      }

      return "Please enter your final path:";
    },
  },
];

const update = () => {
  console.clear();
  updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version,
    updateCheckInterval: 1000,
  }).notify();
};

const welcome = () => {
  console.clear();
  console.log(
    chalk.green(figlet.textSync("ccli", { horizontalLayout: "full" })),
    chalk.red(`\n CLI scaffolding tool, made with ${emoji.emojify(":heart:")}`),
    chalk.yellow(`\n Version: ${pkg.version} \n\n`)
  );
};

const initWizard = () => {
  inquirer.prompt(questions).then((answers: object) => {
    console.log(answers);
  });
};

const stats = () => {};

program
  .name("ccli")
  .description("CLI to conventional commits")
  .version(pkg.version);

program
  .command("split")
  .description("Split a string into substrings and display as an array")
  .argument("<string>", "string to split")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action((str: string, options: any) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.command("check").action(() => {
  update();
});

program.command("init").action(() => {
  welcome();
  initWizard();
});

program.parse(process.argv);
