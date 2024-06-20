import { execSync } from "node:child_process";
import { GIT_COMMANDS } from "../../commands/conventional/consts/gitCommands.js";
import { GIT_INTENTIONS } from "../../commands/conventional/consts/gitIntentions.js";
import chalk from "chalk";

export const isThereUncommittedChanges = (): boolean => {
    try {
        const changes: string = execSync(GIT_COMMANDS.STATUS).toString();

        if (
            changes.search(GIT_INTENTIONS.NO_STAGED) !== -1 ||
            changes.search(GIT_INTENTIONS.UNTRACKED) !== -1 ||
            changes.search(GIT_INTENTIONS.STAGED) !== -1
        ) {
            return true;
        }

        console.log(chalk.green("Impeccable ✨, you have no changes to manage"));
        return false;
    } catch (e) {
        console.log(chalk.red("Wait 🚫, there is no git repository at this path"));
        return false;
    }
};
