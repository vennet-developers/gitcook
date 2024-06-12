import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import type { IInquirerAnswers } from "../types/common.types.js";

export const runPrompt = async (prompt: Record<string, unknown>, defaultAnswer: boolean | string | number | undefined = undefined): Promise<IInquirerAnswers> => {
  let answers = {};
  try {
    answers = await inquirer.prompt([prompt]);
  } catch (error: unknown) {
    if (prompt.interruptedKeyName && error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { [prompt.name as string]: defaultAnswer };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was received");
    }
  }

  return answers;
};
