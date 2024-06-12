import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";

export const footerID: string = "conventional-footer";
export const conventionalFooterPrompt = async (
  prevAnswers: IInquirerAnswers
): Promise<IInquirerAnswers> => {
  const conventionalFooterPrompt: Record<string, unknown> = makePrompt({
    required: false,
    name: footerID,
    type: "editor",
    message: `Commit footer ${chalk.blueBright(
      "[Enter a footer description]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  const footerAnswer: IInquirerAnswers = await runPrompt(conventionalFooterPrompt, "");

  return { ...prevAnswers, ...footerAnswer };
};
