import chalk from "chalk";
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
import {runPrompt} from "../../../core/utils/inquirerRunPrompt.js";

const gitmojiFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.value} ${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.name,
});

const getEmojiByConventionalType = (conventionalType: unknown) => {
  return conventionalType
    ? gitmojiFormatter(
        SUGGESTION_EMOJI_TYPES[conventionalType as string] as string,
        GITEMOJIS
      ).name
    : "";
};

export const gitmojiID: string = "conventional-gitmoji";
export const conventionalGitmojiPrompt = async (
  prevAnswers: IInquirerAnswers
) => {
  const prompt: Record<string, unknown> = makePrompt({
    required: true,
    name: gitmojiID,
    type: "search-list",
    message: `Commit emoji ${chalk.blueBright(
      "[Select the emoji that reference to your commit]"
    )}: `,
    choices: mapToInquirerListAsObject(GITEMOJIS, gitmojiFormatter),
    default: getEmojiByConventionalType(prevAnswers["conventional-type"] ?? ""),
  });

  const gitmojiAnswer: IInquirerAnswers = await runPrompt(prompt, ":sparkles:");

  return { ...prevAnswers, ...gitmojiAnswer };
};
