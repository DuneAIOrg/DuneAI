"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const duneai_1 = require("duneai");
const { HelloWorld: content } = (0, duneai_1.importPrompts)("./src/prompts.prompt");
const runPrimeDynamic = async () => {
    // Create a dynamic with 4 examples, asking each model to say hello.
    const exampleModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
    const PrimeDynamic = (0, duneai_1.createDynamic)({
        name: "PrimeDynamic",
        kind: duneai_1.TOT,
        prompts: exampleModels.map(model => ({
            name: `HelloWorld:${model}`,
            content,
            model
        })),
        log: true,
    });
    // Run the dynamic to run the examples.
    const PrimeDynamicState = await PrimeDynamic.run();
    // Log the resulting state.
    // console.log({ PrimeDynamicState});
};
runPrimeDynamic();
