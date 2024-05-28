import type {
  IFormatterFunction,
  IGenericObject,
} from "../types/common.types.js";

export const mapToInquirerListAsObject = (
  fullObject: IGenericObject,
  formatter: IFormatterFunction
) => {
  const list = [];
  for (const [key] of Object.entries(fullObject)) {
    list.push(formatter(key, fullObject));
  }

  return list;
};

export const makePrompt = (
  options: Record<string, unknown>
): Record<string, unknown>[] => {
  const prompt: Record<string, unknown> = {
    prefix: "🍱 ",
    suffix: "♨︎ ",
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
