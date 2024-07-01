import loading from "loading-cli";

export const initLoading = (message: string): loading.Loading => {
    const load: loading.Loading = loading(message);
    // @ts-ignore
    load.frame(["🕛 ", "🕐 ", "🕑 ", "🕒 ", "🕓 ", "🕔 ", "🕕 ", "🕖 ", "🕗 ", "🕘 ", "🕙 ", "🕚 "]);
    load.color = 'white';
    load.start();

    return load;
}
