import chalk from "chalk";
import { makePrompt, mapToInquirerListAsObject } from "../../../core/utils/inquirerMakePrompt.js";
import type {
  IGenericChoices,
  IGenericObject,
  IInquirerAnswers,
} from "../../../core/types/common.types.js";
import CONVENTIONAL_TYPES from "../consts/conventional-types.json" assert { type: "json" };
import { runPrompt } from "../../../core/utils/inquirerRunPrompt.js";

const conventionalTypesFormatter = (
  key: string,
  fullObject: IGenericObject
): IGenericChoices => ({
  name: `${fullObject[key]?.name} [${fullObject[key]?.description}]`,
  value: fullObject[key]?.value,
});

export const typeID: string = "conventional-type";
export const conventionalTypePrompt = async (prevAnswers: IInquirerAnswers) => {
  const conventionalTypePrompt: Record<string, unknown> = makePrompt({
    required: true,
    name: typeID,
    type: "search-list",
    message: `Commit Type ${chalk.blueBright(
      "[Select the type that corresponds to the nature of your commit]"
    )}: `,
    choices: mapToInquirerListAsObject(
      CONVENTIONAL_TYPES,
      conventionalTypesFormatter
    ),
    default: conventionalTypesFormatter(
      CONVENTIONAL_TYPES.feat.value,
      CONVENTIONAL_TYPES
    ).name,
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

  const typeAnswer: IInquirerAnswers = await runPrompt(conventionalTypePrompt, "<empty>");
  
  return { ...prevAnswers, ...typeAnswer };
};
