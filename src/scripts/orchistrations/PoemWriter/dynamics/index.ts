import * as path from "path";
// @ts-ignore
import { createDynamic, importPrompts, TOT } from "duneai";


const fullPath = path.resolve(__dirname, "../prompts/Prompts.prompt");
const { Continent, Languages, HelloWorld, Respond } = importPrompts(fullPath);

const COUNT = 4;

const context = { count: COUNT };

const PickLocale = createDynamic("PickLocale", context, [
  {
    name: "Continent",
    content: Continent,
    model: "gpt-4o-mini",
  },
  { Languages },
]);
const RespondToAll = createDynamic("RespondToAll", context, [{ Respond }]);

export const SayHelloWorld = createDynamic({
  name: "SayHelloWorld",
  kind: TOT,
  context,
  prompts: [{ HelloWorld }],
  before: async (state: any) => await PickLocale.run(state),
  after: async (state: any) => await RespondToAll.run(state),
});
