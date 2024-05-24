import inquirer from "inquirer";
import { exec, execSync, type ExecException } from "node:child_process";
import searchList from "@elfiner/inquirer-search-list";
import InterruptedPrompt from "inquirer-interrupted-prompt";

import chalk from "chalk";
import {
  SUGGESTION_EMOJI_TYPES,
  GITEMOJIS,
  CONVENTIONAL_TYPES,
} from "./consts/gitmoji.js";

import type {
  IGenericObject,
  IGenericChoices,
  IFormatterFunction,
  chainFn,
  IInquirerAnswers,
} from "./types/conventional.types.js";

const conventionalTypesFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.value,
  key: fullObject[key]?.value,
});

const gitmojiFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.value} ${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.name,
});

const mapToInquirerListAsObject = (
  fullObject: IGenericObject,
  formatter: IFormatterFunction
) => {
  const list = [];
  for (const [key] of Object.entries(fullObject)) {
    list.push(formatter(key, fullObject));
  }

  return list;
};

const manager = {
  state: {},
  initState: function (optionsAsParams: IInquirerAnswers = {}) {
    this.state = optionsAsParams;
    return this;
  },
  pipe: function (...fns: chainFn[]) {
    return fns.reduce(
      async (prevFun, currentFn) => currentFn(await prevFun),
      this.state
    );
  },
};

function removeLineBreaks(str: string) {
  return str.replace(/[\r\n]+/gm, " ");
}

const getEmojiByConventionalType = (conventionalType: string) => {
  return conventionalType
    ? gitmojiFormatter(
        SUGGESTION_EMOJI_TYPES[conventionalType] as string,
        GITEMOJIS
      ).name
    : "";
};

const makePrompt = (
  options: Record<string, unknown>
): Record<string, unknown>[] => {
  const prompt: Record<string, unknown> = {
    prefix: "🧸 ",
    suffix: "🐸 ",
    validate: (value: string) => {
      if (value.length) {
        return true;
      }

      return "This value is required";
    },
    ...options,
  };

  if (!options.required) {
    const key = "validate";
    delete prompt[key];
  }

  return [prompt];
};

const conventionalTypeCommand = async (prevAnswers: IInquirerAnswers) => {
  const conventionalTypePrompt: object = makePrompt({
    required: true,
    name: "conventional-type",
    type: "search-list",
    message: "Select the type that corresponds to the nature of your commit: ",
    choices: mapToInquirerListAsObject(
      CONVENTIONAL_TYPES,
      conventionalTypesFormatter
    ),
    default: CONVENTIONAL_TYPES.feat.value,
    validate: (value: string) => {
      if (
        value.length &&
        (CONVENTIONAL_TYPES as Record<string, unknown>)[value]
      ) {
        return true;
      }

      return "Conventional commit type selected isn't listed";
    },
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalTypePrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-type": "<empty>" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }
  return { ...prevAnswers, ...answers };
};

const conventionalBreakingChangeCommand = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalBreakingChangePrompt: object = makePrompt({
    required: true,
    name: "conventional-breaking-change",
    type: "confirm",
    message: "Are you commit a BREAKING CHANGE? ",
    default: false,
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalBreakingChangePrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-breaking-change": false };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }
  return { ...prevAnswers, ...answers };
};

const conventionalScopeCommand = async (prevAnswers: IInquirerAnswers) => {
  const conventionalScopePrompt: object = makePrompt({
    required: false,
    name: "conventional-scope",
    type: "input",
    message:
      "Enter the scope that describes the section of code you touched [optional]: ",
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalScopePrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-scope": "" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};

const conventionalGitmojiCommand = async (prevAnswers: IInquirerAnswers) => {
  const conventionalGitmojiPrompt: object = makePrompt({
    required: true,
    name: "conventional-gitmoji",
    type: "search-list",
    message: "Select the emoji that reference to your commit: ",
    choices: mapToInquirerListAsObject(GITEMOJIS, gitmojiFormatter),
    default: getEmojiByConventionalType(prevAnswers["conventional-type"] ?? ""),
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalGitmojiPrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-gitmoji": ":sparkles:" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};

const conventionalSummaryDescriptionCommand = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalSummaryDescriptionPrompt: object = makePrompt({
    required: true,
    name: "conventional-summary-description",
    type: "input",
    message: "Enter a summary description: ",
    default: undefined,
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalSummaryDescriptionPrompt);
  } catch (error: unknown) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = {
        "conventional-summary-description": "Empty summary description",
      };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};

const conventionalLongDescriptionCommand = async (
  prevAnswers: IInquirerAnswers
) => {
  const conventionalLongDescriptionPrompt: object = makePrompt({
    required: false,
    name: "conventional-long-description",
    type: "editor",
    message: "Enter a long description [optional]: ",
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalLongDescriptionPrompt);
  } catch (error) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      answers = { "conventional-long-description": "" };
      console.log("Prompt has been interrupted!");
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};

const conventionalFooterCommand = async (prevAnswers: IInquirerAnswers) => {
  const conventionalFooterPrompt: object = makePrompt({
    required: false,
    name: "conventional-footer",
    type: "editor",
    message: "Enter a footer description [optional]: ",
    default: undefined,
    interruptedKeyName: "q",
  });

  let answers = {};
  try {
    answers = await inquirer.prompt(conventionalFooterPrompt);
  } catch (error) {
    if (error === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.log("Prompt has been interrupted!");
      answers = { "conventional-footer": "" };
    } else {
      console.log("Unexpected error was recivied");
    }
  }

  return { ...prevAnswers, ...answers };
};

const buildCommitHeader = (answers: IInquirerAnswers) => {
  const gitemoji = answers["conventional-gitmoji"];
  const conventionalCommit = `${answers["conventional-type"]}${
    answers["conventional-scope"] ? `(${answers["conventional-scope"]})` : ""
  }${answers["conventional-breaking-change"] ? "!:" : ":"} ${
    GITEMOJIS[gitemoji as keyof typeof GITEMOJIS].value
  } ${answers["conventional-summary-description"]}`;

  return `${conventionalCommit.trim()}\n\n`;
};

const buildCommitBody = (answers: IInquirerAnswers) => {
  const conventionalCommit = `${
    answers["conventional-breaking-change"] &&
    answers["conventional-long-description"]
      ? "BREAKING CHANGE:"
      : ""
  }${answers["conventional-long-description"]}`;

  return `${conventionalCommit.trim()}${
    answers["conventional-long-description"] ? "\n\n" : ""
  }`;
};

const buildCommitFooter = (answers: IInquirerAnswers) => {
  const conventionalCommit = answers["conventional-footer"]?.trim();

  return `${conventionalCommit?.trim()}`;
};

const prepareConventionalCommit = (answers: IInquirerAnswers) => {
  return (
    buildCommitHeader(answers) +
    buildCommitBody(answers) +
    buildCommitFooter(answers)
  );
};

const isThereChanges = (): boolean => {
  try {
    const changes = execSync("git status").toString();

    if (changes.indexOf("no changes added to commit") !== -1) {
      return true;
    }

    console.log(chalk.green("Impeccable ✨, you have no changes to manage"));
    return false;
  } catch (e) {
    console.log(chalk.red("🚫 Ups, there is no git repository at this path"));
    return false;
  }
};

export const conventionalCommit = async () => {
  if (isThereChanges()) {
    InterruptedPrompt.fromAll(inquirer);
    inquirer.registerPrompt("search-list", searchList);

    const answers: IInquirerAnswers = await manager
      .initState({})
      .pipe(
        conventionalTypeCommand,
        conventionalBreakingChangeCommand,
        conventionalScopeCommand,
        conventionalGitmojiCommand,
        conventionalSummaryDescriptionCommand,
        conventionalLongDescriptionCommand,
        conventionalFooterCommand
      );

    const conventionalCommit = prepareConventionalCommit(answers);

    const name = execSync("git config --global user.name").toString();
    console.log(
      chalk.green(
        `\nCongrats ${removeLineBreaks(
          name
        ).trim()}, You have created a new conventional commit 🎉 \n`
      )
    );

    exec(
      `git add -A && git commit -am "${conventionalCommit}"`,
      (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
      }
    );
  }
};
