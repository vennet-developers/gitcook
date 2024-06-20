export const GIT_COMMANDS = {
  GET_CONFIG_USERNAME: "git config --global user.name",
  ADD_AND_COMMIT: `git add -A && git commit -am "{commit}"`,
  PUSH: "git push",
  STATUS: "git status",
  LOG: "git log --oneline",
  NEW_BRANCH: "git switch --create '{branch-name}' '{branch-origin}'",
  PUSH_BRANCH: "git push --set-upstream '{remote}' '{branch-name}'",
  GET_BRANCHES: "git branch",
  GET_CURRENT_BRANCH: "git branch --show-current", // "git rev-parse --abbrev-ref HEAD",
};
