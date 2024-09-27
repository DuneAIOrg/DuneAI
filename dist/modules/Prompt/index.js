"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompt = exports.importPrompts = void 0;
const settings_1 = require("../settings");
const dependencies_1 = require("./dependencies");
Object.defineProperty(exports, "importPrompts", { enumerable: true, get: function () { return dependencies_1.importPrompts; } });
const createPrompt = async (params) => {
    let newPrompt;
    if (typeof params === 'function') {
        return createPrompt(await params());
    }
    else {
        if (typeof params === 'string') {
            newPrompt = (0, dependencies_1.stringToPrompt)(params);
        }
        else if (typeof params === 'object' && !(params === null || params === void 0 ? void 0 : params.name)) {
            const [name, content] = Object.entries(params)[0];
            newPrompt = (0, dependencies_1.keyValuePairToPrompt)(name, content);
        }
        else if (typeof params === 'object') {
            newPrompt = params;
        }
        else {
            throw new Error('Invalid prompt params');
        }
    }
    return Object.assign(Object.assign(Object.assign({}, (0, settings_1.getSettings)()), newPrompt), { run: (state, log = false) => (0, dependencies_1.run)(newPrompt, state, log) });
};
exports.createPrompt = createPrompt;
