import InterruptedPrompt from "inquirer-interrupted-prompt";
import inquirer from "inquirer";
import searchList from "@elfiner/inquirer-search-list";

export const initInquirerAddons = () => {
    InterruptedPrompt.fromAll(inquirer);
    inquirer.registerPrompt("search-list", searchList);
}