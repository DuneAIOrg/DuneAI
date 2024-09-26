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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyValuePairToPrompt = exports.stringToPrompt = exports.importPrompts = exports.run = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mustache_1 = __importDefault(require("mustache"));
const constants_1 = require("../constants");
const adapter_1 = require("../../adapter");
const utils_1 = require("../../utils");
const logger_1 = __importDefault(require("../../middleware/logger"));
const run = (prompt, state, log) => __awaiter(void 0, void 0, void 0, function* () {
    let runningPrompt = prompt;
    runningPrompt = prefixSpice(runningPrompt);
    runningPrompt = interpolateSpice(runningPrompt);
    runningPrompt = interpolateState(runningPrompt, state);
    if (log)
        logPrompt(prompt, 'sending', runningPrompt.content);
    const completion = yield performCompletion(runningPrompt);
    if (log)
        logPrompt(prompt, 'complete', JSON.stringify(completion));
    return Promise.resolve(Object.assign(Object.assign(Object.assign({}, suffixSpice(runningPrompt, completion.content || '', completion.raw || {})), runningPrompt), { completion: completion.content }));
});
exports.run = run;
const logPrompt = (prompt, status, content) => {
    const maxLength = 0;
    const contentWithoutNewlines = content.replace(/\n/g, '');
    const preview = contentWithoutNewlines.length > maxLength ? contentWithoutNewlines.substring(0, maxLength) + '...' : contentWithoutNewlines;
    const { tokenCount } = (0, utils_1.countTokens)(content, 'gpt-4o-mini');
    const message = `${prompt.name} - ${status.toUpperCase()}: ${preview} (Total tokens: ${tokenCount.toLocaleString()})`;
    logger_1.default.info(message);
};
const importPrompts = (dirOrFilePath) => {
    const absolutePath = path_1.default.resolve(process.cwd(), dirOrFilePath);
    if (fs_1.default.lstatSync(absolutePath).isDirectory()) {
        const prompts = {};
        const filePaths = fs_1.default
            .readdirSync(absolutePath)
            .filter((file) => file.endsWith(".prompt"));
        filePaths.forEach((filePath) => {
            const fileName = path_1.default.basename(filePath, path_1.default.extname(filePath));
            prompts[fileName] = importPrompt(path_1.default.join(absolutePath, filePath));
        });
        return prompts;
    }
    else {
        const content = importPrompt(absolutePath);
        return parsePromptsFromFile(content);
    }
};
exports.importPrompts = importPrompts;
const interpolateSpice = (prompt) => {
    const interpolate = (content, params) => {
        const keys = Object.keys(params);
        const values = Object.values(params);
        return new Function(...keys, `return \`${content}\`;`)(...values);
    };
    const content = interpolate(prompt.content, prompt.spice);
    return Object.assign(Object.assign({}, prompt), { content });
};
const prefixSpice = (prompt) => {
    const startedAt = new Date();
    const currentTime = new Date();
    const seed = Math.random();
    return Object.assign(Object.assign({}, prompt), { spice: Object.assign(Object.assign({}, prompt.spice), { currentTime,
            startedAt,
            seed }) });
};
const suffixSpice = (prompt, completion, raw) => {
    var _a, _b;
    const finishedAt = new Date();
    const duration = (finishedAt.getTime() -
        (((_b = (_a = prompt.spice) === null || _a === void 0 ? void 0 : _a.startedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0));
    const { tokenCount: tokensSent } = (0, utils_1.countTokens)(prompt.content, prompt.model);
    const { tokenCount: tokensReceived } = (0, utils_1.countTokens)(completion, prompt.model);
    const totalTokens = tokensSent + tokensReceived;
    return Object.assign(Object.assign({}, prompt), { spice: Object.assign(Object.assign({}, prompt.spice), { finishedAt,
            duration, modelUsed: prompt.model, adapterUsed: prompt.adapter, tokensSent,
            tokensReceived,
            totalTokens,
            raw }) });
};
const interpolateState = (prompt, state) => {
    const content = mustache_1.default.render(prompt.content, Object.assign(Object.assign({}, state), {
        C: state.context,
        Context: state.context,
    }));
    return Object.assign(Object.assign({}, prompt), { content });
};
const performCompletion = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, adapter_1.ask)(prompt.content, prompt.adapter, prompt.model);
});
const importPrompt = (filePath) => {
    const absolutePath = path_1.default.resolve(process.cwd(), filePath);
    return fs_1.default.readFileSync(absolutePath, "utf8");
};
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
const stringToPrompt = (content) => {
    return {
        name: constants_1.LAMBDA,
        content,
    };
};
exports.stringToPrompt = stringToPrompt;
const keyValuePairToPrompt = (name, content) => {
    return {
        name,
        content,
    };
};
exports.keyValuePairToPrompt = keyValuePairToPrompt;
