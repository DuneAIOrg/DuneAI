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
const Prompt_1 = __importDefault(require("../Prompt"));
const store_1 = require("../../store");
exports.defaultDependencies = {
    beforeLife: () => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(`beforeLife: ${JSON.stringify(context)}`);
    }),
    afterDeath: () => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(`afterDeath: ${JSON.stringify(context)}`);
    }),
    runChainOfThought(dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Running ${dynamic.name} Dynamic`);
            const { setGeneration } = store_1.useStore.getState();
            for (const prompt of dynamic.prompts) {
                const generation = yield prompt.run(dynamic);
                setGeneration(dynamic.name, prompt.name, generation);
            }
            const result = store_1.useStore.getState().generations[dynamic.name];
            return result;
        });
    },
    runTreeOfThought(dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);
            const { getState } = store_1.useStore;
            const { setGeneration } = getState();
            let result = Object.assign(Object.assign({}, getState().generations[dynamic.name]), dynamic.context);
            const promptResults = yield Promise.all(dynamic.prompts.map((prompt) => {
                const newPrompt = (0, Prompt_1.default)().create(prompt);
                return newPrompt.run(dynamic);
            }));
            promptResults.forEach((output) => {
                if (typeof output === "object" && output !== null) {
                    const name = Object.keys(output)[0];
                    result = Object.assign({}, result);
                    setGeneration(dynamic.name, name, output[name]);
                }
            });
            return result;
        });
    },
    run(dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getState } = store_1.useStore;
            const { setGeneration } = getState();
            if (dynamic.beforeLife) {
                const beforeLifeResult = yield dynamic.beforeLife(getState().generations[dynamic.name]);
                // @ts-ignore
                if (beforeLifeResult) {
                    setGeneration(dynamic.name, "beforeLife", beforeLifeResult);
                }
            }
            console.log(`Starting Dynamic: ${dynamic.kind}`);
            let result;
            switch (dynamic.kind) {
                case "chainOfThought":
                    result = yield this.runChainOfThought(dynamic);
                    break;
                case "treeOfThought":
                    result = yield this.runTreeOfThought(dynamic);
                    break;
                default:
                    console.error("Unknown dynamic type");
                    return {};
            }
            if (dynamic.afterDeath) {
                const afterDeathResult = yield dynamic.afterDeath(result);
                // @ts-ignore
                if (afterDeathResult) {
                    setGeneration(dynamic.name, "afterDeath", afterDeathResult);
                }
            }
            setGeneration(dynamic.name, "context", dynamic.context);
            return result;
        });
    },
};
