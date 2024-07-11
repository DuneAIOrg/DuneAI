"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamic = void 0;
const dependencies_1 = require("./dependencies");
const Prompt_1 = __importDefault(require("../Prompt"));
const store_1 = require("../../store");
const createDynamic = (params, overrides = {}) => {
    var _a;
    const dynamicDependencies = Object.assign(Object.assign({}, dependencies_1.defaultDependencies), overrides);
    const { getState } = store_1.useStore;
    const { setContext } = getState();
    setContext(params.context);
    const instantiatedPrompts = ((_a = params === null || params === void 0 ? void 0 : params.prompts) === null || _a === void 0 ? void 0 : _a.map((prompt) => {
        if ("name" in prompt && "content" in prompt) {
            return prompt;
        }
        else {
            const key = Object.keys(prompt)[0];
            const value = prompt[key];
            return (0, Prompt_1.default)().create({ name: key, content: value });
        }
    })) || [];
    // @ts-ignore
    return Object.freeze(Object.assign(Object.assign({ kind: "chainOfThought" }, params), { prompts: instantiatedPrompts, run: function () {
            return dynamicDependencies.run(this);
        }, beforeLife: dynamicDependencies.beforeLife, afterDeath: dynamicDependencies.afterDeath }));
};
exports.createDynamic = createDynamic;
const Dynamic = (params, overrides = {}) => (0, exports.createDynamic)(params, overrides);
exports.default = Dynamic;
