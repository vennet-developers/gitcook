import type { OptionValues } from "commander";
import chalk from "chalk";
import type { chainFn, IInquirerAnswers } from "../../core/types/common.types.js";
import { stateManager } from "../../core/utils/stateManager.js";
import { isThereUncommittedChanges } from "../../core/utils/commandInteractions.js";
import {replaceSpacesToUnderscore, stringFormat} from "../../core/utils/strings.js";
import { branchTypesPrompt, typeID } from "./prompts/branchTypesPrompt.js";
import { branchNamePrompt, nameID } from "./prompts/branchNamePrompt.js";
import { branchOriginPrompt, originID } from "./prompts/branchOriginPrompt.js";
import {execSync} from "node:child_process";
import {GIT_COMMANDS} from "../conventional/consts/gitCommands.js";

const prepareBranchName = (answers: IInquirerAnswers) => {
    return `${answers[typeID] ? `${answers[typeID]}/` : ''}${replaceSpacesToUnderscore(answers[nameID] as string)}`.trim();
}

export const branches = async (commandOptions: OptionValues): Promise<void> => {
    if (!isThereUncommittedChanges()) {
        const prompts: chainFn[] = [];

        if(commandOptions.custom) {
            prompts.push(branchNamePrompt);
            prompts.push(branchOriginPrompt);
        } else {
            prompts.push(branchTypesPrompt);
            prompts.push(branchNamePrompt);
            prompts.push(branchOriginPrompt);
        }

        const answers: IInquirerAnswers = await stateManager
        .initState({})
        .pipe(...prompts);

        const branchName: string = prepareBranchName(answers);
        const branchOrigin: string = answers[originID] as string;

        const createNewBranchCommand: string = stringFormat(GIT_COMMANDS.NEW_BRANCH, {
            branchName,
            branchOrigin: branchOrigin.replace("* ", "").trim(),
        });

        const pushNewBranchCommand: string = stringFormat(GIT_COMMANDS.PUSH_BRANCH, {
            remote: "origin",
            branchName,
        });

        try {
            const createNewBranchExecution: string = execSync(createNewBranchCommand).toString();
            console.log(createNewBranchExecution);
            const pushNewBranchExecution: string = execSync(pushNewBranchCommand).toString();
            console.log(pushNewBranchExecution);
        } catch (error) {
            console.log(error);
        }

    } else {
        console.log(`\n${chalk.red('There are changes pending to commit.')} You can run ${chalk.blue('> gcook commit')} command\n`);
    }
}