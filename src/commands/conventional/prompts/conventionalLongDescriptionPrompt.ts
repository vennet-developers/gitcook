import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";

export const longDescriptionID: string = "conventional-long-description";
export const conventionalLongDescriptionPrompt = async (
  prevAnswers: IInquirerAnswers
): Promise<IInquirerAnswers> => {
  const prompt: Record<string, unknown> = makePrompt({
    required: false,
    name: longDescriptionID,
    type: "editor",
    message: `Commit body ${chalk.blueBright(
      "[Enter a long description]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  const gitmojiAnswer: IInquirerAnswers = await runPrompt(prompt, "");

  return { ...prevAnswers, ...gitmojiAnswer };
};
