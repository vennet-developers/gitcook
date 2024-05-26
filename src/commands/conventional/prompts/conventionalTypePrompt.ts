import InterruptedPrompt from "inquirer-interrupted-prompt";
import inquirer from "inquirer";
import {
  makePrompt,
  mapToInquirerListAsObject,
} from "../../commons/inquirerMakePrompt.js";
import type {
  IGenericChoices,
  IGenericObject,
  IInquirerAnswers,
} from "../types/conventional.types.js";
import { CONVENTIONAL_TYPES } from "../consts/gitmoji.js";

const conventionalTypesFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.value,
  key: fullObject[key]?.value,
});

export const conventionalTypePrompt = async (prevAnswers: IInquirerAnswers) => {
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
