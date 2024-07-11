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
exports.importPrompts = void 0;
exports.default = Prompt;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mustache_1 = __importDefault(require("mustache"));
const adapters_1 = require("../../adapters");
const store_1 = require("../../store");
const utils_1 = require("../../utils");
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
const run = (prompt, dynamic) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = store_1.useStore.getState();
    // @ts-ignore
    const iterationValue = ((_a = prompt.iteratable) === null || _a === void 0 ? void 0 : _a.iterationValue) || "";
    // @ts-ignore
    const iteration = ((_b = prompt.iteratable) === null || _b === void 0 ? void 0 : _b.iteration) || -1;
    const promptWithIteration = (iteration &&
        (0, utils_1.interpolateIteration)(prompt.content, {
            iteration,
            iterationValue,
        })) ||
        prompt.content;
    const interpolatedContent = mustache_1.default.render(promptWithIteration, Object.assign(Object.assign({}, Object.assign({ context: data.context }, data.generations)), { generationName: `${dynamic.name}.${prompt.name}`, iterationValue,
        iteration }));
    // console.log(`++++\n${interpolatedContent}++++`);
    console.log(`Invoking Prompt: ${prompt.name}`);
    const aiResponse = (yield (0, adapters_1.ask)(interpolatedContent, prompt.model));
    return aiResponse;
});
function Prompt() {
    return {
        create: function (content) {
            if (typeof content === "string") {
                return Object.assign(Object.assign({}, this.prompt), { content });
            }
            else {
                return Object.assign(Object.assign({}, this.prompt), content);
            }
        },
        prompt: {
            name: "Prompt",
            content: "Default prompt content",
            model: "LLAMA3",
            run: function (dynamic) {
                return run(this, dynamic);
            },
        },
    };
}
