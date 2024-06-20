import type {chainFn, IInquirerAnswers} from "../types/common.types.js";

export const stateManager = {
    state: {},
    initState: function (optionsAsParams: IInquirerAnswers = {}) {
        this.state = optionsAsParams;
        return this;
    },
    pipe: async function (...fns: chainFn[]) {
        return fns.reduce(
            async (prevFun, currentFn) => currentFn(await (prevFun as Promise<IInquirerAnswers>)),
            this.state
        );
    },
};

