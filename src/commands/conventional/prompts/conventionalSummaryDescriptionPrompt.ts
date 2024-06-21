import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import {runPrompt} from "../../../core/utils/inquirerRunPrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";

export const summaryDescriptionID: string = "conventional-summary-description";
export const conventionalSummaryDescriptionPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const prompt: Record<string, unknown> = makePrompt({
    required: true,
    name: summaryDescriptionID,
    type: "input",
    message: `Commit description ${chalk.blueBright(
      "[Enter a summary description]"
    )}: `,
    default: undefined,
  });

  const summaryDescriptionAnswer: IInquirerAnswers = await runPrompt(prompt, "Empty summary description");

  return { ...prevAnswers, ...summaryDescriptionAnswer };
};
