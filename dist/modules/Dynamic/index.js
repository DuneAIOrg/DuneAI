"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamic = exports.ADAPTER = exports.MODEL = void 0;
const dependencies_1 = require("./dependencies");
const __1 = require("../../");
const Prompt_1 = require("../Prompt");
const store_1 = require("../../store");
require("dotenv/config");
const Cybernetics_1 = require("../Cybernetics");
exports.MODEL = process.env.DEFAULT_MODEL || "Meta-Llama-3-8B-Instruct.Q4_0.gguf";
exports.ADAPTER = process.env.DEFAULT_ADAPTER || "GPT4ALL";
const createDynamic = (params, context, prompts = {}, overrides = {}) => {
    var _a, _b, _c, _d, _e;
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
    const instantiatedPrompts = 
    // @ts-ignore
    ((_a = dynamicParams === null || dynamicParams === void 0 ? void 0 : dynamicParams.prompts) === null || _a === void 0 ? void 0 : _a.map((prompt) => {
        if (typeof prompt === "string") {
            return (0, Prompt_1.createPrompt)({ name: Cybernetics_1.LAMBDA, content: prompt, model: dynamicParams.model || exports.MODEL, adapter: dynamicParams.adapter || exports.ADAPTER });
        }
        else if (typeof prompt === "object" && (prompt === null || prompt === void 0 ? void 0 : prompt.content)) {
            return (0, Prompt_1.createPrompt)(Object.assign({ model: dynamicParams.model || exports.MODEL, adapter: dynamicParams.adapter || exports.ADAPTER }, prompt));
        }
        else {
            return (0, Prompt_1.createPrompt)({
                model: dynamicParams.model || exports.MODEL,
                adapter: dynamicParams.adapter || exports.ADAPTER,
                name: Object.keys(prompt)[0],
                content: Object.values(prompt)[0],
            });
        }
    })) || [];
    return Object.assign(Object.assign({ kind: (_b = dynamicParams.kind) !== null && _b !== void 0 ? _b : __1.COT, name: (_c = dynamicParams.name) !== null && _c !== void 0 ? _c : "defaultDynamic", model: (_d = dynamicParams.model) !== null && _d !== void 0 ? _d : exports.MODEL, adapter: (_e = dynamicParams.adapter) !== null && _e !== void 0 ? _e : exports.ADAPTER }, dynamicParams), { prompts: instantiatedPrompts, run: function (initialState) {
            return dynamicDependencies.run(initialState || {}, this);
        }, before: dynamicParams.before || dynamicDependencies.before, after: dynamicParams.after || dynamicDependencies.after });
};
exports.createDynamic = createDynamic;
const Dynamic = (params, context = {}, prompts = [], overrides = {}) => (0, exports.createDynamic)(params, context, prompts, overrides);
exports.default = Dynamic;
