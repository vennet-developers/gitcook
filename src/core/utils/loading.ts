import loading from "loading-cli";
import chalk from "chalk";

export const initLoading = (message: string): loading.Loading => {
    const load: loading.Loading = loading(message);
    // @ts-ignore
    load.frame(["◐", "◓", "◑", "◒"]);
    load.start();

    return load;
}