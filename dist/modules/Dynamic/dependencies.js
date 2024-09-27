"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Prompt_1 = require("../Prompt");
const constants_1 = require("../constants");
const store_1 = require("../../store");
const run = async (initialState, dynamic) => {
    const { initializeState, setContext } = store_1.useStore.getState();
    initializeState(initialState);
    // @ts-ignore
    setContext(dynamic === null || dynamic === void 0 ? void 0 : dynamic.context);
    if (dynamic.before) {
        const beforeResult = (await dynamic.before(store_1.useStore.getState().state));
        initializeState(beforeResult);
    }
    const strategy = dynamic.kind === constants_1.COT
        ? runChainOfThought
        : runTreeOfThought;
    await strategy(dynamic);
    if (dynamic.after) {
        const afterResult = (await dynamic.after(Object.assign({}, store_1.useStore.getState().state)));
        initializeState(afterResult);
    }
    return store_1.useStore.getState().state;
};
exports.run = run;
const runChainOfThought = async (dynamic) => {
    for (const prompt of dynamic.prompts || []) {
        const { state, context } = store_1.useStore.getState();
        const promptObject = await (0, Prompt_1.createPrompt)(prompt);
        const generation = await promptObject.run(Object.assign(Object.assign({}, state), { context }), dynamic.log);
        store_1.useStore.getState().setState(dynamic.name, generation.name, generation.completion, dynamic.log ? generation.spice : false);
    }
};
const runTreeOfThought = async (dynamic) => {
    await Promise.all(dynamic.prompts.map(async (prompt) => {
        const { state, context } = store_1.useStore.getState();
        const promptObject = await (0, Prompt_1.createPrompt)(prompt);
        const generation = await promptObject.run(Object.assign(Object.assign({}, state), { context: context }), dynamic.log);
        store_1.useStore.getState().setState(dynamic.name, generation.name, generation.completion, dynamic.log ? generation.spice : false);
    }));
};
