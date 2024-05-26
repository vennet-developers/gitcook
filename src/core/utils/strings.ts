export const removeLineBreaks = (value: string) => {
  return value.replace(/[\r\n]+/gm, " ");
};

export const camelize = (str: string): string => {
  if (!str.match(/[\s_-]/g)) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .join("-")
      .toLowerCase();
  }

  return str;
};

export const firstLevelCamelize = (object: Record<string, string | number>) => {
  const newObject: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(object)) {
    newObject[camelize(key)] = value;
  }

  return newObject;
};

export const stringFormat = (
  value: string,
  ...args: unknown[] | Record<string, string | number>[]
): string => {
  const firstElement = args[0] as Record<string, string | number>;
  if (firstElement && typeof firstElement === "object") {
    const camelizedObject = firstLevelCamelize(firstElement);

    return value.replace(/{([0-9a-zA-Z-_]+)}/g, (match: string): string => {
      const key = match.replace(/[}{]/g, "");
      return ((camelizedObject as Record<string, string | number>)[key] ??
        match) as string;
    });
  }

  return value.replace(
    /{([0-9]+)}/g,
    (match: string, index: number): string => {
      return (
        typeof args[index] === "undefined" ? match : args[index]
      ) as string;
    }
  );
};
