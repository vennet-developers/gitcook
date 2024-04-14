#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();

program
  .name("string-util")
  .description("CLI to some JavaScript string utilities")
  .version(version);

program
  .command("split")
  .description("Split a string into substrings and display as an array")
  .argument("<string>", "string to split")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse(process.argv);
