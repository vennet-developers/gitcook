import { execSync } from "node:child_process";
import searchList from "@elfiner/inquirer-search-list";
import chalk from "chalk";
import type { OptionValues } from "commander";
import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

import type {
  IInquirerAnswers,
  chainFn,
} from "../../core/types/common.types.js";
import { removeLineBreaks, stringFormat } from "../../core/utils/strings.js";
import { GIT_COMMANDS } from "./consts/gitCommands.js";
import { GIT_INTENTIONS } from "./consts/gitIntentions.js";
import { GITEMOJIS } from "./consts/gitmoji.js";
import {
  breakingChangeID,
  breakingChangeValueID,
  conventionalBreakingChangePrompt
} from "./prompts/conventionalBreakingChangePrompt.js";
import {conventionalFooterPrompt, footerID} from "./prompts/conventionalFooterPrompt.js";
import {conventionalGitmojiPrompt, gitmojiID} from "./prompts/conventionalGitmojiPrompt.js";
import {conventionalLongDescriptionPrompt, longDescriptionID} from "./prompts/conventionalLongDescriptionPrompt.js";
import {conventionalScopePrompt, scopeID} from "./prompts/conventionalScopePrompt.js";
import {
  conventionalSummaryDescriptionPrompt,
  summaryDescriptionID
} from "./prompts/conventionalSummaryDescriptionPrompt.js";
import {conventionalTypePrompt, typeID} from "./prompts/conventionalTypePrompt.js";

const stateManager = {
  state: {},
  initState: function (optionsAsParams: IInquirerAnswers = {}) {
    this.state = optionsAsParams;
    return this;
  },
  pipe: async function (...fns: chainFn[]) {
    return fns.reduce(
      async (prevFun, currentFn) => currentFn(await (prevFun as Promise<IInquirerAnswers>)),
      this.state
    );
  },
};

const buildCommitHeader = (answers: IInquirerAnswers): string => {
  const gitemoji: string | undefined = answers[gitmojiID] as string | undefined;
  const conventionalCommit: string = `${answers[typeID]}${
    answers[scopeID] ? `(${answers[scopeID]})` : ""
  }${answers[breakingChangeID] ? "!:" : ":"} ${
    GITEMOJIS[gitemoji as keyof typeof GITEMOJIS].value
  } ${answers[summaryDescriptionID]}`;

  return `${conventionalCommit.trim()}\n\n`;
};

const buildCommitBody = (answers: IInquirerAnswers) => {
  return answers[longDescriptionID] ? `${(answers[longDescriptionID] as string).trim()}\n\n` : "";
};

const buildCommitFooter = (answers: IInquirerAnswers) => {
  const breakingChangeValue: string = `${
      answers[breakingChangeID] &&
      answers[breakingChangeValueID]
          ? `BREAKING CHANGE: ${(answers[breakingChangeValueID] as string).trim()} \n`
          : ""
  }`;

  const conventionalFooter: string = answers[footerID] ? (answers[footerID] as string).trim() : "";

  return `${breakingChangeValue}${conventionalFooter}`.trim();
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
    const changes: string = execSync(GIT_COMMANDS.STATUS).toString();

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

export const conventionalCommit = async (commandOptions: OptionValues): Promise<void> => {
  if (isThereUncommittedChanges()) {
    InterruptedPrompt.fromAll(inquirer);
    inquirer.registerPrompt("search-list", searchList);

    const prompts: chainFn[] = [
      conventionalTypePrompt,
      conventionalScopePrompt,
      conventionalGitmojiPrompt,
      conventionalSummaryDescriptionPrompt,
      conventionalBreakingChangePrompt,
    ]

    if (!commandOptions.compactMode) {
      prompts.push(conventionalLongDescriptionPrompt);
      prompts.push(conventionalFooterPrompt);
    }

    const answers: IInquirerAnswers = await stateManager
        .initState({})
        .pipe(...prompts);

    const conventionalCommit: string = prepareConventionalCommit(answers).trim();

    if (commandOptions.previewMode) {
      console.log(`\n\n${chalk.blueBright(conventionalCommit)}\n\n`);
      return;
    }

    try {
      const name: string = execSync(GIT_COMMANDS.GET_CONFIG_USERNAME).toString();
      const congrats: string = `Congrats ${removeLineBreaks(name).trim()}`;
      console.log(
        chalk.green(
          `\n${congrats.trim()}, You have created a new conventional commit 🎉 \n`
        )
      );

      const command: string = stringFormat(GIT_COMMANDS.ADD_AND_COMMIT, {
        commit: conventionalCommit,
      });

      const executeCommit: string = execSync(command).toString();
      console.log(executeCommit);
      const executePush: string = execSync(GIT_COMMANDS.PUSH).toString();
      console.log(executePush);
    } catch (error) {
      console.log(error);
    }
  }
};
