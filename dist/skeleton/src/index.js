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
// @ts-ignore
const __1 = require("../../");
const { HelloWorld: content } = (0, __1.importPrompts)("./src/skeleton/src/prompts.prompt");
const runPrimeDynamic = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create a dynamic with 4 examples, asking each model to say hello.
    const exampleModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
    const PrimeDynamic = (0, __1.createDynamic)({
        name: "PrimeDynamic",
        kind: __1.TOT,
        prompts: exampleModels.map(model => ({
            name: `HelloWorld:${model}`,
            content,
            model
        })),
        log: true,
    });
    // Run the dynamic to run the examples.
    const PrimeDynamicState = yield PrimeDynamic.run();
    // Log the resulting state.
    // console.log({ PrimeDynamicState});
});
runPrimeDynamic();
