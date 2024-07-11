import * as path from "path";
import DuneAI from "../../../";
import { DynamicType } from "../../../types";

const fullPath = path.resolve(__dirname, "../prompts/Prompts.prompt");
const { Languages, HelloWorld, Respond } = DuneAI.importPrompts(fullPath);

const COUNT = 5;

export const SayHelloWorld: DynamicType = DuneAI.createDynamic({
  name: "Say",
  context: {
    Count: COUNT,
  },
  prompts: [
    { Languages },
    ...DuneAI.Iterator([{ HelloWorld }], { iterations: COUNT }),
    { Respond },
  ],
});
