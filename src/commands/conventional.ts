import inquirer from "inquirer";
import GITEMOJIS from "./gitemoji.json" assert { type: "json" };
import CONVENTIONAL_TYPES from "./conventional-types.json" assert { type: "json" };
import searchList from "@elfiner/inquirer-search-list";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { exec, execSync, type ExecException } from "node:child_process";

type IGenericMetadata = {
  name: string;
  value: string | number;
  description: string;
};

type IGenericChoices = {
  name: string;
  value?: string | number;
  key?: string | number;
};

type IGenericObject = {
  [key: string]: IGenericMetadata;
};

type IInquirerAnswers = { [key: string]: string };

type chainFn = (
  prevAnswers: IInquirerAnswers
) => Promise<IInquirerAnswers> | string;

type IFormatterFunction = (
  key: string,
  fullObject: IGenericObject
) => string | IGenericChoices;

const SUGGESTION_EMOJI_TYPES = {
  [CONVENTIONAL_TYPES.build.value]: GITEMOJIS[":construction:"].name,
  [CONVENTIONAL_TYPES.chore.value]: GITEMOJIS[":wrench:"].name,
  [CONVENTIONAL_TYPES.ci.value]: GITEMOJIS[":construction_worker:"].name,
  [CONVENTIONAL_TYPES.docs.value]: GITEMOJIS[":memo:"].name,
  [CONVENTIONAL_TYPES.feat.value]: GITEMOJIS[":sparkles:"].name,
  [CONVENTIONAL_TYPES.fix.value]: GITEMOJIS[":bug:"].name,
  [CONVENTIONAL_TYPES.perf.value]: GITEMOJIS[":zap:"].name,
  [CONVENTIONAL_TYPES.refactor.value]: GITEMOJIS[":recycle:"].name,
  [CONVENTIONAL_TYPES.revert.value]: GITEMOJIS[":rewind:"].name,
  [CONVENTIONAL_TYPES.style.value]: GITEMOJIS[":lipstick:"].name,
  [CONVENTIONAL_TYPES.test.value]: GITEMOJIS[":test_tube:"].name,
};

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

const pipe = (...fns: chainFn[]) =>
  fns.reduce(async (prevFun, currentFn) => currentFn(await prevFun), {});

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

const getEmojiByConventionalType = (conventionalType: string) => {
  return conventionalType
    ? gitmojiFormatter(
        SUGGESTION_EMOJI_TYPES[conventionalType] as string,
        GITEMOJIS
      ).name
    : "";
};

const conventionalTypeCommand = async (prevAnswers: IInquirerAnswers) => {
  const conventionalTypePrompt: object = [
    {
      name: "conventional-type",
      type: "search-list",
      message: "Enter the type that corresponds to the nature of your commit: ",
      choices: mapToInquirerListAsObject(
        CONVENTIONAL_TYPES,
        conventionalTypesFormatter
      ),
      default: CONVENTIONAL_TYPES.feat.value,
      validate: (value: string) => {
        if (value.length) {
          return true;
        }

        return "Please select the commit type";
      },
    },
  ];

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
  const conventionalBreakingChangePrompt: object = [
    {
      name: "conventional-breaking-change",
      type: "confirm",
      message: "Are you commit a BREAKING CHANGE?",
      default: false,
    },
  ];

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
  const conventionalScopePrompt: object = [
    {
      name: "conventional-scope",
      type: "input",
      message:
        "Enter the scope that describes the section of code you touched [optional]: ",
      default: undefined,
    },
  ];

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
  const conventionalGitmojiPrompt: object = [
    {
      name: "conventional-gitmoji",
      type: "search-list",
      message: "Select the emoji that reference to your commit: ",
      choices: mapToInquirerListAsObject(GITEMOJIS, gitmojiFormatter),
      default: getEmojiByConventionalType(
        prevAnswers["conventional-type"] ?? ""
      ),
      validate: (value: string) => {
        if (value.length) {
          return true;
        }

        return "Please select the commit type";
      },
    },
  ];

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
  const conventionalSummaryDescriptionPrompt: object = [
    {
      name: "conventional-summary-description",
      type: "input",
      message: "Enter a summary description:",
      default: undefined,
      validate: (value: string) => {
        if (value.length) {
          return true;
        }

        return "Please enter a summary description";
      },
    },
  ];

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
  const conventionalLongDescriptionPrompt: object = [
    {
      name: "conventional-long-description",
      type: "editor",
      message: "Enter a long description [optional]:",
      default: undefined,
    },
  ];

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
  const conventionalFooterPrompt: object = [
    {
      name: "conventional-footer",
      type: "editor",
      message: "Enter a footer description [optional]:",
      default: undefined,
    },
  ];

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

export const conventionalCommit = async () => {
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
  console.log(`Lo lograste ${name}, has creado un conventional commit`);

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
};
