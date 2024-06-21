import chalk from "chalk";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";

export const nameID: string = "branch-name";
export const branchNamePrompt = async (
    prevAnswers: IInquirerAnswers
) => {
    const prompt: Record<string, unknown> = makePrompt({
        required: true,
        name: nameID,
        type: "input",
        message: `Branch name ${chalk.blueBright(
            "[Enter a branch name based on intention]"
        )}: `,
        default: undefined,
    });

    const branchNameAnswer: IInquirerAnswers = await runPrompt(prompt, "<Empty>");

    return { ...prevAnswers, ...branchNameAnswer };
};
