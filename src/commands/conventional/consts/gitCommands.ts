export const GIT_COMMANDS = {
  GET_CONFIG_USERNAME: "git config --global user.name",
  ADD_AND_COMMIT: `git add -A && git commit -am "{commit}"`,
  PUSH: "git push",
  STATUS: "git status",
  LOG: "git log --oneline --graph",
  FETCH_ALL: "git fetch --all",
  NEW_BRANCH: "git checkout -b {branch-name} {branch-origin}",
  PUSH_BRANCH: "git push --set-upstream {remote} {branch-name}",
  GET_BRANCHES: "git branch -a",
  GET_CURRENT_BRANCH: "git branch --show-current", // "git rev-parse --abbrev-ref HEAD",
  PULL_ALL: "git fetch --all && git pull --all"
};
