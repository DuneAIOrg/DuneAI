"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Prompt_1 = require("../Prompt");
const constants_1 = require("../constants");
const store_1 = require("../../store");
const run = (initialState, dynamic) => __awaiter(void 0, void 0, void 0, function* () {
    const { initializeState, setContext } = store_1.useStore.getState();
    initializeState(initialState);
    // @ts-ignore
    setContext(dynamic === null || dynamic === void 0 ? void 0 : dynamic.context);
    if (dynamic.before) {
        const beforeResult = (yield dynamic.before(store_1.useStore.getState().state));
        initializeState(beforeResult);
    }
    const strategy = dynamic.kind === constants_1.COT
        ? runChainOfThought
        : runTreeOfThought;
    yield strategy(dynamic);
    if (dynamic.after) {
        const afterResult = (yield dynamic.after(Object.assign({}, store_1.useStore.getState().state)));
        initializeState(afterResult);
    }
    return store_1.useStore.getState().state;
});
exports.run = run;
const runChainOfThought = (dynamic) => __awaiter(void 0, void 0, void 0, function* () {
    for (const prompt of dynamic.prompts || []) {
        const { state, context } = store_1.useStore.getState();
        const promptObject = yield (0, Prompt_1.createPrompt)(prompt);
        const generation = yield promptObject.run(Object.assign(Object.assign({}, state), { context }), dynamic.log);
        store_1.useStore.getState().setState(dynamic.name, generation.name, generation.completion, dynamic.log ? generation.spice : false);
    }
});
const runTreeOfThought = (dynamic) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(dynamic.prompts.map((prompt) => __awaiter(void 0, void 0, void 0, function* () {
        const { state, context } = store_1.useStore.getState();
        const promptObject = yield (0, Prompt_1.createPrompt)(prompt);
        const generation = yield promptObject.run(Object.assign(Object.assign({}, state), { context: context }), dynamic.log);
        store_1.useStore.getState().setState(dynamic.name, generation.name, generation.completion, dynamic.log ? generation.spice : false);
    })));
});
