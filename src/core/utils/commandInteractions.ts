import {exec, execSync} from "node:child_process";
import { GIT_COMMANDS } from "../../commands/conventional/consts/gitCommands.js";
import { GIT_INTENTIONS } from "../../commands/conventional/consts/gitIntentions.js";
import chalk from "chalk";

export const executeCommand = async (command: string): Promise<{ stdout: string, stderr: string }> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }

            resolve({
                stdout,
                stderr,
            })
        });
    });
}

export const checkUncommittedChanges = (): void => {
    if (!isThereUncommittedChanges()) {
        console.log(chalk.green("Impeccable ✨, you have no changes to manage"));
    }
}

export const isThereUncommittedChanges = (): boolean => {
    try {
        const changes: string = execSync(GIT_COMMANDS.STATUS).toString();
        return changes.search(GIT_INTENTIONS.NO_STAGED) !== -1 ||
            changes.search(GIT_INTENTIONS.UNTRACKED) !== -1 ||
            changes.search(GIT_INTENTIONS.STAGED) !== -1;
    } catch (e) {
        return false;
    }
};
