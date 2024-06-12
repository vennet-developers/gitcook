import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import {runPrompt} from "../../../core/utils/inquirerRunPrompt.js";

export const scopeID: string = "conventional-scope";
export const conventionalScopePrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalScopePrompt: Record<string, unknown> = makePrompt({
    required: false,
    name: scopeID,
    type: "input",
    message: `Commit Scope ${chalk.blueBright(
      "[Enter the scope that describes the section of code you touched]"
    )} ${chalk.green("(optional)")}: `,
    default: undefined,
    interruptedKeyName: "q",
  });

  const scopeAnswer: IInquirerAnswers = await runPrompt(conventionalScopePrompt, "");

  return { ...prevAnswers, ...scopeAnswer };
};
