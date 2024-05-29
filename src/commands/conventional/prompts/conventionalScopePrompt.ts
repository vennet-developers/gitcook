import inquirer from "inquirer";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import chalk from "chalk";

export const conventionalScopePrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalScopePrompt: object = makePrompt({
    required: false,
    name: "conventional-scope",
    type: "input",
    message: `Commit Scope ${chalk.blueBright(
      "[Enter the scope that describes the section of code you touched]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalScopePrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-scope": "" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};
