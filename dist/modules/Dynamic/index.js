"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamic = void 0;
const dependencies_1 = require("./dependencies");
const Prompt_1 = require("../Prompt");
const store_1 = require("../../store");
const createDynamic = (params, context, prompts = {}, overrides = {}) => {
    var _a, _b, _c;
    let dynamicParams;
    let dynamicOverrides;
    if (typeof params === "string") {
        dynamicParams = {
            name: params,
            context: context,
            prompts: prompts,
        };
        dynamicOverrides = overrides;
    }
    else {
        dynamicParams = params;
        dynamicOverrides = prompts;
    }
    const dynamicDependencies = Object.assign(Object.assign({}, dependencies_1.defaultDependencies), dynamicOverrides);
    const { setContext } = store_1.useStore.getState();
    setContext(context !== null && context !== void 0 ? context : dynamicParams.context);
    const instantiatedPrompts = ((_a = dynamicParams === null || dynamicParams === void 0 ? void 0 : dynamicParams.prompts) === null || _a === void 0 ? void 0 : _a.map((prompt) => {
        if ("name" in prompt && "content" in prompt) {
            return prompt;
        }
        else {
            const key = Object.keys(prompt)[0];
            const value = prompt[key];
            return (0, Prompt_1.createPrompt)({ name: key, content: value });
        }
    })) || [];
    return Object.freeze(Object.assign(Object.assign({ kind: (_b = dynamicParams.kind) !== null && _b !== void 0 ? _b : "chainOfThought", name: (_c = dynamicParams.name) !== null && _c !== void 0 ? _c : "defaultDynamic" }, dynamicParams), { prompts: instantiatedPrompts, run: function (initialState) {
            return dynamicDependencies.run(initialState || {}, this);
        }, before: dynamicParams.before || dynamicDependencies.before, after: dynamicParams.after || dynamicDependencies.after }));
};
exports.createDynamic = createDynamic;
const Dynamic = (params, context = {}, prompts = {}, overrides = {}) => (0, exports.createDynamic)(params, context, prompts, overrides);
exports.default = Dynamic;
