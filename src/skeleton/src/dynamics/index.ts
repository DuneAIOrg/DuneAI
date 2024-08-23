import * as path from "path";
import { createDynamic, importPrompts, Iterator, TOT } from "../../../";
import { DynamicType } from "../../../types";

const fullPath = path.resolve(__dirname, "../prompts/Prompts.prompt");
const { Continent, Languages, HelloWorld, Respond } = importPrompts(fullPath);

const COUNT = 4;

const context = { count: COUNT };

const PickLocale = createDynamic("PickLocale", context, [
  { Continent },
  { Languages },
]);
const RespondToAll = createDynamic("RespondToAll", context, [{ Respond }]);

export const SayHelloWorld: DynamicType = createDynamic({
  name: "SayHelloWorld",
  kind: TOT,
  context,
  prompts: Iterator([{ HelloWorld }], { iterations: COUNT }),
  before: async ({ state }) => await PickLocale.run(state),
  after: async ({ state }) => await RespondToAll.run(state),
});
