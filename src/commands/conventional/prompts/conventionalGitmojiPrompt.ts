import InterruptedPrompt from "inquirer-interrupted-prompt";
import inquirer from "inquirer";
import {
  makePrompt,
  mapToInquirerListAsObject,
} from "../../../core/utils/inquirerMakePrompt.js";
import { GITEMOJIS, SUGGESTION_EMOJI_TYPES } from "../consts/gitmoji.js";
import type {
  IGenericChoices,
  IGenericObject,
  IInquirerAnswers,
} from "../../../core/types/common.types.js";

const gitmojiFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.value} ${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.name,
});

const getEmojiByConventionalType = (conventionalType: string) => {
  return conventionalType
    ? gitmojiFormatter(
        SUGGESTION_EMOJI_TYPES[conventionalType] as string,
        GITEMOJIS
      ).name
    : "";
};

export const conventionalGitmojiPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
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
