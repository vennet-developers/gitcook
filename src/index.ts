#!/usr/bin/env node --no-warnings=ExperimentalWarning
process.removeAllListeners("warning");

import updateNotifier from "update-notifier";
import chalk from "chalk";

import { Command } from "commander";
import figlet from "figlet";
import * as emoji from "node-emoji";

import pkg from "../package.json" assert { type: "json" };

const program = new Command();

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
    chalk.green(figlet.textSync("Clitype", { horizontalLayout: "full" })),
    chalk.red(`\n CLI scaffolding tool, made with ${emoji.emojify(":heart:")}`),
    chalk.yellow(`\n Version: ${pkg.version} \n\n`)
  );
};

program
  .name("clitype")
  .description("CLI to some JavaScript string utilities")
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
});

program.parse(process.argv);
