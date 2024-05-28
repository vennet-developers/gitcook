import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";

export const conventionalSummaryDescriptionPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalSummaryDescriptionPrompt: object = makePrompt({
    required: true,
    name: "conventional-summary-description",
    type: "input",
    message: "Enter a summary description: ",
    default: undefined,
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalSummaryDescriptionPrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = {
        "conventional-summary-description": "Empty summary description",
      };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};
