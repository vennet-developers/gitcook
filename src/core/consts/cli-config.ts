import pkg from "../../../package.json" assert { type: "json" };

export const CLI_CONFIG = {
  NAME: pkg.name,
  FRIENDLY_NAME: "Git Cook",
  VERSION: pkg.version,
  BIN_NAME: Object.keys(pkg.bin)[0] as string,
  DOCUMENTATION_URL: "https://bit.ly/gitcook-changelog",
};
