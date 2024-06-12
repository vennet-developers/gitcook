#!/usr/bin/env node --no-warnings=ExperimentalWarning
process.removeAllListeners("warning");

import chalk from "chalk";
import Box from "cli-box";
import { Command, type OptionValues } from "commander";
import figlet from "figlet";
import * as emoji from "node-emoji";
import updateNotifier from "update-notifier";
import { conventionalCommit } from "./commands/conventional/entryPoint.js";
import { CLI_CONFIG } from "./core/consts/cli-config.js";

const program: Command = new Command();

const checkPackageVersion = (isCheckMode = true) => {
  const notifier = updateNotifier({
    pkg: {
      name: CLI_CONFIG.NAME,
      version: CLI_CONFIG.VERSION,
    },
  });

  const getBox = (...args: string[]) => {
    const box = Box(
      {
        w: 50,
        h: 6,
      },
      args.join("\n")
    );

    console.log(chalk.blueBright(box));
    console.log("\n");
  };

  if (notifier.update) {
    getBox(
      `Update available ${chalk.bold.gray(
        notifier.update.current
      )} → ${chalk.bold.green(notifier.update.current)}`,
      `Run ${chalk.cyan(`npm i ${notifier.update.name} -g`)} to update.`,
      `For more information follow our CHANGELOG\n${chalk.cyan(
        CLI_CONFIG.DOCUMENTATION_URL
      )}`
    );
    return;
  }

  if (notifier.update === undefined && isCheckMode) {
    getBox(
      chalk.green("🎉 Awesome, you have the latest version"),
      `Current version ${chalk.green(CLI_CONFIG.NAME)}@${chalk.green(
        CLI_CONFIG.VERSION
      )}`
    );
  }
};

const welcome = () => {
  console.clear();
  console.log(
    `\n${chalk.green(
      figlet.textSync(CLI_CONFIG.FRIENDLY_NAME, {
        horizontalLayout: "full",
        width: 60,
        font: "Elite",
        whitespaceBreak: true,
      })
    )}`,
    chalk.blueBright(`\nCLI tool, made with ${emoji.emojify(":heart:")}`),
    chalk.blue(`\nVersion: ${chalk.green(CLI_CONFIG.VERSION)}\n`)
  );
};

const stats = async () => {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${CLI_CONFIG.NAME}`
  );

  const data: { downloads: number } = (await response.json()) as {
    downloads: number;
  };
  console.log(`Tha package has ${data.downloads || 0} downloads last month`);
};

try {
  program
    .name(CLI_CONFIG.BIN_NAME)
    .description("CLI to manage git actions easily")
    .version(CLI_CONFIG.VERSION);

  program
    .command("check")
    .description("Checks if you are up to date")
    .action(() => {
      checkPackageVersion();
    });

  program
    .command("stats")
    .description("Check how many downloads has the tool")
    .action(async () => {
      await stats();
    });

  program
    .command("init")
    .description("Wizard to create a conventional commit")
    .option("-pm, --preview-mode", "Preview the final structure of the message")
    .option("-cm, --compact-mode", "Create a simple conventional commit")
    .action(async (options: OptionValues) => {
      welcome();
      checkPackageVersion(false);
      await conventionalCommit(options);
    });

  program.parse(process.argv);
} catch (e) {
  console.log("Incompatibility error related to file support");
}
