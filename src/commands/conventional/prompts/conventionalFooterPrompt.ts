import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { makePrompt } from "../../commons/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../types/conventional.types.js";

export const conventionalFooterPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalFooterPrompt: object = makePrompt({
    required: false,
    name: "conventional-footer",
    type: "editor",
    message: "Enter a footer description [optional]: ",
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
