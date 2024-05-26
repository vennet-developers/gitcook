import InterruptedPrompt from "inquirer-interrupted-prompt";
import inquirer from "inquirer";
import { makePrompt } from "../../commons/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../types/conventional.types.js";

export const conventionalBreakingChangePrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalBreakingChangePrompt: object = makePrompt({
    required: true,
    name: "conventional-breaking-change",
    type: "confirm",
    message: "Are you commit a BREAKING CHANGE? ",
    default: false,
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalBreakingChangePrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-breaking-change": false };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }
  return { ...prevAnswers, ...answers };
};
