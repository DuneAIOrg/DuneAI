import * as path from "path";
import { createDynamic, importPrompts, TOT, } from "../../../";
import { Accumulator } from "../../../modules/Cybernetics";
import { DynamicType } from "../../../types";

const fullPath = path.resolve(__dirname, "../prompts/Prompts.prompt");
const { Continent, Languages, HelloWorld, Respond } = importPrompts(fullPath);

const COUNT = 4;

const context = { count: COUNT };

const PickLocale = createDynamic("PickLocale", context, [
  {
    name: "Continent",
    content: Continent,
    model: "gpt-4o-mini",
    adapter: "OPENAI",
  },
  { 
    name: "Languages",
    content: Languages,
  },
]);
const RespondToAll = createDynamic("RespondToAll", context, [{ Respond }]);

export const SayHelloWorld: () => Promise<DynamicType> = async () => createDynamic({
  name: "SayHelloWorld",
  kind: TOT,
  context,
  model: "gpt-4o-mini",
  adapter: "OPENAI",
  // @ts-ignore
  prompts: Accumulator([{ HelloWorld }], { replicate: COUNT }),
  before: async ({ state }) => await PickLocale.run(state),
  after: async ({ state }) => await RespondToAll.run(state),
});
