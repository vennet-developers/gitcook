import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";

export const breakingChangeID: string = "conventional-breaking-change";
export const breakingChangeValueID: string = "conventional-breaking-change-value";

export const conventionalBreakingChangePrompt = async (
  prevAnswers: IInquirerAnswers
): Promise<IInquirerAnswers> => {
  const conventionalBreakingChangePrompt: Record<string, unknown> = makePrompt({
    required: true,
    name: breakingChangeID,
    type: "confirm",
    message: "Are you commit a BREAKING CHANGE? ",
    default: false,
  });

  const conventionalBreakingChangeValuePrompt: Record<string, unknown> = makePrompt({
    required: true,
    name: breakingChangeValueID,
    type: "input",
    message: `Describe this BREAKING CHANGE ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  const breakingChangeAnswer: IInquirerAnswers = await runPrompt(conventionalBreakingChangePrompt, false);
  if (breakingChangeAnswer[breakingChangeID]) {
    const breakingChangeValueAnswer: IInquirerAnswers = await runPrompt(conventionalBreakingChangeValuePrompt, "");
    return { ...prevAnswers, ...breakingChangeAnswer, ...breakingChangeValueAnswer } as IInquirerAnswers;
  }

  return { ...prevAnswers, ...breakingChangeAnswer } as IInquirerAnswers;
};
