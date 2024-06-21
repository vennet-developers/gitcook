import chalk from "chalk";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";

export const typeID: string = "branch-type";
export const branchTypesPrompt = async (prevAnswers: IInquirerAnswers) => {
    const branchingModelList: string[] = ["feature", "fix", "hotfix", "release"];
    const prompt: Record<string, unknown> = makePrompt({
        required: true,
        name: typeID,
        type: "search-list",
        message: `Branch type ${chalk.blueBright(
            "[Choose the type of branch to start coding]"
        )}: `,
        choices: branchingModelList,
        default: "feature",
        validate: (value: string) => {
            if (
                value.length &&
                branchingModelList.includes(value)
            ) {
                return true;
            }

            return "Branch type selected isn't listed";
        },
    });

    const typeAnswer: IInquirerAnswers = await runPrompt(prompt, "<empty>");

    return { ...prevAnswers, ...typeAnswer };
};