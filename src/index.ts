#!/usr/bin/env node --no-warnings=ExperimentalWarning
process.removeAllListeners("warning");

import chalk from "chalk";
import updateNotifier from "update-notifier";
import { Command, type OptionValues } from "commander";
import figlet from "figlet";
import * as emoji from "node-emoji";
import { conventionalCommit } from "./commands/conventional/entryPoint.js";
import pkg from "../package.json" assert { type: "json" };

const BIN_NAME: string = Object.keys(pkg.bin)[0] as string;

const program = new Command();

const checkPackageVersion = () => {
  const notifier = updateNotifier({
    pkg: {
      name: pkg.name,
      version: pkg.version,
    },
  });
  notifier.notify();

  if (notifier.update) {
    console.log(notifier.update);
  } else {
    console.log(chalk.green("Gitool is up to date!"));
  }
};

const welcome = () => {
  console.clear();
  console.log(
    chalk.green(
      figlet.textSync("gitool", {
        horizontalLayout: "full",
        width: 60,
        font: "DOS Rebel",
        whitespaceBreak: true,
      })
    ),
    chalk.blueBright(`\n\nCLI tool, made with ${emoji.emojify(":heart:")}`),
    chalk.blue(`\nVersion: ${pkg.version} \n`)
  );
};

const stats = async () => {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${pkg.name}`
  );

  const data: { downloads: number } = (await response.json()) as {
    downloads: number;
  };
  console.log(`Tha package has ${data.downloads || 0} downloads last month`);
};

try {
  program
    .name(BIN_NAME)
    .description("CLI to manage git actions easily")
    .version(pkg.version);

  program
    .command("check")
    .description("Checks if you are up to date")
    .action(() => {
      checkPackageVersion();
    });

  program
    .command("stats")
    .description("Check how many downloads has the tool")
    .action(() => {
      stats();
    });

  program
    .command("init")
    .description("Wizard to create a conventional commit")
    .option("-pm, --preview-mode", "Preview the final structure of the message")
    .action((options: OptionValues) => {
      checkPackageVersion();
      welcome();
      conventionalCommit(options);
    });

  program.parse(process.argv);
} catch (e) {
  console.log("Inconpatibility error realted to file support");
}
