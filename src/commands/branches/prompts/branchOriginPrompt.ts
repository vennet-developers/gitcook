import chalk from "chalk";
import type { IInquirerAnswers } from "../../../core/types/common.types.js";
import { makePrompt } from "../../../core/utils/inquirerMakePrompt.js";
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";
import { execSync } from "node:child_process";
import { GIT_COMMANDS } from "../../conventional/consts/gitCommands.js";

const getLocalBranches = async (): Promise<string[]> => {
    const branches: string = execSync(GIT_COMMANDS.GET_BRANCHES).toString();
    const localBranches: string[] = branches?.split('\n')?.map((branch) => branch.trim())?.filter(branch => !!branch && branch.indexOf('HEAD') === -1);
    return localBranches || [];
}

const getSelectedBranch = (branches: string[]): string => {
    return branches?.filter(value => /[*]/.test(value))[0] || "";
}

export const originID: string = "branch-origin";
export const branchOriginPrompt = async (prevAnswers: IInquirerAnswers) => {
    const branches: string[] = await getLocalBranches();
    const prompt: Record<string, unknown> = makePrompt({
        required: true,
        name: originID,
        type: "search-list",
        message: `Branch origin ${chalk.blueBright(
            "[Choose the branch origin for the new branch]"
        )}: `,
        choices: branches,
        default: getSelectedBranch(branches),
        validate: (value: string) => {
            if (
                value.length &&
                branches.includes(value)
            ) {
                return true;
            }

            return "Branch type selected isn't listed";
        },
    });

    const originAnswer: IInquirerAnswers = await runPrompt(prompt, "<empty>");

    return { ...prevAnswers, ...originAnswer };
};