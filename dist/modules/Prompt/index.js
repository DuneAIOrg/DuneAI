"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPrompts = exports.parsePromptsFromFile = exports.importPrompt = exports.createPrompt = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("./dependencies");
const createPrompt = (params, overrides = {}) => {
    var _a, _b;
    const promptDependencies = Object.assign(Object.assign({}, dependencies_1.defaultDependencies), overrides);
    return Object.freeze(Object.assign(Object.assign({ name: (_a = params.name) !== null && _a !== void 0 ? _a : "defaultPrompt", model: params.model, adapter: (_b = params.adapter) !== null && _b !== void 0 ? _b : "GPT4ALL" }, params), { run: function (state) {
            return promptDependencies.run(this, state);
        } }));
};
exports.createPrompt = createPrompt;
const Prompt = (params, overrides = {}) => (0, exports.createPrompt)(params, overrides);
exports.default = Prompt;
const importPrompt = (filePath) => {
    const absolutePath = path_1.default.resolve(process.cwd(), filePath);
    return fs_1.default.readFileSync(absolutePath, "utf8");
};
exports.importPrompt = importPrompt;
const parsePromptsFromFile = (content) => {
    const prompts = {};
    const sections = content.split(/^#\s*(\w+)/gm);
    for (let i = 1; i < sections.length; i += 2) {
        const name = sections[i];
        const promptContent = sections[i + 1].trim();
        prompts[name] = promptContent;
    }
    return prompts;
};
exports.parsePromptsFromFile = parsePromptsFromFile;
const importPrompts = (dirOrFilePath) => {
    const absolutePath = path_1.default.resolve(process.cwd(), dirOrFilePath);
    if (fs_1.default.lstatSync(absolutePath).isDirectory()) {
        const prompts = {};
        const filePaths = fs_1.default
            .readdirSync(absolutePath)
            .filter((file) => file.endsWith(".prompt"));
        filePaths.forEach((filePath) => {
            const fileName = path_1.default.basename(filePath, path_1.default.extname(filePath));
            prompts[fileName] = (0, exports.importPrompt)(path_1.default.join(absolutePath, filePath));
        });
        return prompts;
    }
    else {
        const content = (0, exports.importPrompt)(absolutePath);
        return (0, exports.parsePromptsFromFile)(content);
    }
};
exports.importPrompts = importPrompts;
