// @ts-ignore
import { importPrompts, createDynamic } from "duneai";

// console.log({ duneai});

const { HelloWorld } = importPrompts("./src/skeleton/src/prompts.prompt");

const runPrimeDynamic = async () => {
  const PrimeDynamic = createDynamic("PrimeDynamic", {} , [{ HelloWorld }]);
  const resultingState = await PrimeDynamic.run();
  console.log(resultingState);
};

runPrimeDynamic();

