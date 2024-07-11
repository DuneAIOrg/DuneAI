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
exports.defaultDependencies = void 0;
const mustache_1 = __importDefault(require("mustache"));
const adapters_1 = require("../../adapters");
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.defaultDependencies = {
    run(prompt, dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const data = store_1.useStore.getState();
            // @ts-ignore
            const iterationValue = ((_a = prompt.iteratable) === null || _a === void 0 ? void 0 : _a.iterationValue) || 0;
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
            // console.log(`Invoking Prompt: ${prompt.name}`);
            const aiResponse = (yield (0, adapters_1.ask)(interpolatedContent, prompt.model));
            return aiResponse;
        });
    },
};
