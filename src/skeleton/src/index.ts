// @ts-ignore
import { importPrompts, createDynamic, TOT } from "duneai";

const { HelloWorld: content } = importPrompts("./prompts.prompt");

const runPrimeDynamic = async () => {

  // Create a dynamic with 4 examples, asking each model to say hello.
  const exampleModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
  const PrimeDynamic = createDynamic({
    name: "PrimeDynamic",
    kind: TOT,
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

