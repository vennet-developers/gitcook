import inquirer from "inquirer";
import chalk from "chalk";
import type { OptionValues } from "commander";
import { execSync } from "node:child_process";
import searchList from "@elfiner/inquirer-search-list";
import InterruptedPrompt from "inquirer-interrupted-prompt";

import { GITEMOJIS } from "./consts/gitmoji.js";
import type {
  chainFn,
  IInquirerAnswers,
} from "../../core/types/common.types.js";
import { GIT_INTENTIONS } from "./consts/gitIntentions.js";
import { removeLineBreaks, stringFormat } from "../../core/utils/strings.js";
import { conventionalTypePrompt } from "./prompts/conventionalTypePrompt.js";
import { conventionalBreakingChangePrompt } from "./prompts/conventionalBreakingChangePrompt.js";
import { conventionalScopePrompt } from "./prompts/conventionalScopePrompt.js";
import { conventionalGitmojiPrompt } from "./prompts/conventionalGitmojiPrompt.js";
import { conventionalSummaryDescriptionPrompt } from "./prompts/conventionalSummaryDescriptionPrompt.js";
import { conventionalLongDescriptionPrompt } from "./prompts/conventionalLongDescriptionPrompt.js";
import { conventionalFooterPrompt } from "./prompts/conventionalFooterPrompt.js";
import { GIT_COMMANDS } from "./consts/gitCommands.js";

const stateManager = {
  state: {},
  initState: function (optionsAsParams: IInquirerAnswers = {}) {
    this.state = optionsAsParams;
    return this;
  },
  pipe: function (...fns: chainFn[]) {
    return fns.reduce(
      async (prevFun, currentFn) => currentFn(await prevFun),
      this.state
    );
  },
};

const buildCommitHeader = (answers: IInquirerAnswers) => {
  const gitemoji = answers["conventional-gitmoji"];
  const conventionalCommit = `${answers["conventional-type"]}${
    answers["conventional-scope"] ? `(${answers["conventional-scope"]})` : ""
  }${answers["conventional-breaking-change"] ? "!:" : ":"} ${
    GITEMOJIS[gitemoji as keyof typeof GITEMOJIS].value
  } ${answers["conventional-summary-description"]}`;

  return `${conventionalCommit.trim()}\n\n`;
};

const buildCommitBody = (answers: IInquirerAnswers) => {
  const conventionalCommit = `${
    answers["conventional-breaking-change"] &&
    answers["conventional-long-description"]
      ? "BREAKING CHANGE: "
      : ""
  }${answers["conventional-long-description"]}`;

  return `${conventionalCommit.trim()}${
    answers["conventional-long-description"] ? "\n\n" : ""
  }`;
};

const buildCommitFooter = (answers: IInquirerAnswers) => {
  const conventionalCommit = answers["conventional-footer"]?.trim();

  return `${conventionalCommit?.trim()}`;
};

const prepareConventionalCommit = (answers: IInquirerAnswers) => {
  return (
    buildCommitHeader(answers) +
    buildCommitBody(answers) +
    buildCommitFooter(answers)
  );
};

const isThereUncommittedChanges = (): boolean => {
  try {
    const changes = execSync(GIT_COMMANDS.STATUS).toString();

    if (
      changes.search(GIT_INTENTIONS.NO_STAGED) !== -1 ||
      changes.search(GIT_INTENTIONS.UNTRACKED) !== -1 ||
      changes.search(GIT_INTENTIONS.STAGED) !== -1
    ) {
      return true;
    }

    console.log(chalk.green("Impeccable ✨, you have no changes to manage"));
    return false;
  } catch (e) {
    console.log(chalk.red("Wait 🚫, there is no git repository at this path"));
    return false;
  }
};

export const conventionalCommit = async (commandOptions: OptionValues) => {
  if (isThereUncommittedChanges()) {
    InterruptedPrompt.fromAll(inquirer);
    inquirer.registerPrompt("search-list", searchList);

    const answers: IInquirerAnswers = await stateManager
      .initState({})
      .pipe(
        conventionalTypePrompt,
        conventionalScopePrompt,
        conventionalGitmojiPrompt,
        conventionalSummaryDescriptionPrompt,
        conventionalLongDescriptionPrompt,
        conventionalFooterPrompt,
        conventionalBreakingChangePrompt,
      );

    const conventionalCommit = prepareConventionalCommit(answers);

    if (commandOptions.previewMode) {
      console.log(`\n\n${chalk.blueBright(conventionalCommit)}\n\n`);
      return;
    }

    try {
      const name = execSync(GIT_COMMANDS.GET_CONFIG_USERNAME).toString();
      const congrats = `Congrats ${removeLineBreaks(name).trim()}`;
      console.log(
        chalk.green(
          `\n${congrats.trim()}, You have created a new conventional commit 🎉 \n`
        )
      );

      const command = stringFormat(GIT_COMMANDS.ADD_AND_COMMIT, {
        commit: conventionalCommit,
      });

      const executeCommit = execSync(command).toString();
      console.log(executeCommit);
      const executePush = execSync(GIT_COMMANDS.PUSH).toString();
      console.log(executePush);
    } catch (error) {
      console.log(error);
    }
  }
};
