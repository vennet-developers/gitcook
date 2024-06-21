import { execSync } from "node:child_process";
import chalk from "chalk";
import type { OptionValues } from "commander";

import type {
  IInquirerAnswers,
  chainFn,
} from "../../core/types/common.types.js";
import { removeLineBreaks, stringFormat } from "../../core/utils/strings.js";
import { GIT_COMMANDS } from "./consts/gitCommands.js";
import { GITEMOJIS } from "./consts/gitmoji.js";
import {
  breakingChangeID,
  breakingChangeValueID,
  conventionalBreakingChangePrompt
} from "./prompts/conventionalBreakingChangePrompt.js";
import { conventionalFooterPrompt, footerID } from "./prompts/conventionalFooterPrompt.js";
import { conventionalGitmojiPrompt, gitmojiID} from "./prompts/conventionalGitmojiPrompt.js";
import { conventionalLongDescriptionPrompt, longDescriptionID } from "./prompts/conventionalLongDescriptionPrompt.js";
import { conventionalScopePrompt, scopeID } from "./prompts/conventionalScopePrompt.js";
import {
  conventionalSummaryDescriptionPrompt,
  summaryDescriptionID
} from "./prompts/conventionalSummaryDescriptionPrompt.js";
import { conventionalTypePrompt, typeID } from "./prompts/conventionalTypePrompt.js";
import { stateManager } from "../../core/utils/stateManager.js";
import {
  checkUncommittedChanges,
  executeCommand,
  isThereUncommittedChanges
} from "../../core/utils/commandInteractions.js";
import {initLoading} from "../../core/utils/loading.js";

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



export const conventionalCommit = async (commandOptions: OptionValues): Promise<void> => {
  checkUncommittedChanges();
  if (isThereUncommittedChanges()) {

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

    const name: string = (await executeCommand(GIT_COMMANDS.GET_CONFIG_USERNAME)).stdout;
    const congrats: string = `Congrats ${removeLineBreaks(name).trim()}`;
    const command: string = stringFormat(GIT_COMMANDS.ADD_AND_COMMIT, {
      commit: conventionalCommit,
    });

    const loading = initLoading("Committing changes...");
    try {
      await executeCommand(command);
      await executeCommand(GIT_COMMANDS.PUSH);
      loading.succeed(chalk.green(`\n${congrats.trim()}, You have created a new conventional commit 🎉 \n`))
    } catch (error) {
      loading.fail(error as string);
    }
  }
};
