import { exec } from "node:child_process";
import chalk from "chalk";
import type { OptionValues } from "commander";
import loading from 'loading-cli';
import type { IInquirerAnswers, chainFn } from "../../core/types/common.types.js";
import { executeCommand, isThereUncommittedChanges } from "../../core/utils/commandInteractions.js";
import { stateManager } from "../../core/utils/stateManager.js";
import {replaceSpacesToUnderscore, stringFormat} from "../../core/utils/strings.js";
import { GIT_COMMANDS } from "../conventional/consts/gitCommands.js";
import { branchNamePrompt, nameID } from "./prompts/branchNamePrompt.js";
import { branchOriginPrompt, originID } from "./prompts/branchOriginPrompt.js";
import { branchTypesPrompt, typeID } from "./prompts/branchTypesPrompt.js";
import {initLoading} from "../../core/utils/loading.js";

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

        const branchOriginNormalized: string = branchOrigin.replace("* ", "").trim();

        const createNewBranchCommand: string = stringFormat(GIT_COMMANDS.NEW_BRANCH, {
            branchName,
            branchOrigin: branchOriginNormalized,
        });

        const pushNewBranchCommand: string = stringFormat(GIT_COMMANDS.PUSH_BRANCH, {
            remote: "origin",
            branchName,
        });

        const loading = initLoading(`Creating ${chalk.blueBright(branchName)} branch...`);
        try {
            await executeCommand(GIT_COMMANDS.FETCH_ALL);
            await executeCommand(createNewBranchCommand);
            await executeCommand(pushNewBranchCommand);

            loading.succeed(`Branch ${chalk.green(branchName)} was created successfully.`);
        } catch (error) {
            loading.fail(error as string);
        }
    } else {
        console.log(`\n${chalk.red('There are changes pending to commit.')} You can run ${chalk.blue('> gcook commit')} command\n`);
    }
}