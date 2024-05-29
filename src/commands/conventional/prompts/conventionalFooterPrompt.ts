import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import chalk from "chalk";

export const conventionalFooterPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalFooterPrompt: object = makePrompt({
    required: false,
    name: "conventional-footer",
    type: "editor",
    message: `Commit footer ${chalk.blueBright(
      "[Enter a footer description]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalFooterPrompt);
  } catch (error) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.log("Prompt has been interrupted!");
      answers = { "conventional-footer": "" };
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};
