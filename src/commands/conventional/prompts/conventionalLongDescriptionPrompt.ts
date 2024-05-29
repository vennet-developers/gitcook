import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import chalk from "chalk";

export const conventionalLongDescriptionPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalLongDescriptionPrompt: object = makePrompt({
    required: false,
    name: "conventional-long-description",
    type: "editor",
    message: `Commit body ${chalk.blueBright(
      "[Enter a long description]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalLongDescriptionPrompt);
  } catch (error) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-long-description": "" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};
