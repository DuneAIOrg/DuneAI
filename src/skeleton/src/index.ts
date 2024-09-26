// @ts-ignore
import { createDynamic, importPrompts } from "duneai";

const { HelloWorld } = importPrompts("./prompts.prompt");

const runPrimeDynamic = async () => {
  const PrimeDynamic = createDynamic("PrimeDynamic", {} , [{ HelloWorld }]);
  const resultingState = await PrimeDynamic.run();
  console.log(resultingState);
};

runPrimeDynamic();

