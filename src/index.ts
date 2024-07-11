import Prompt, { importPrompts } from "./modules/Prompt";
import Dynamic, { createDynamic } from "./modules/Dynamic";
import Iterator from "./modules/Iterator";

export const OPENAI_API_KEY = "1";

export default {
  Prompt,
  Dynamic,
  Iterator,
  createDynamic,
  importPrompts,
  COT: "chainOfThought",
  TOT: "treeOfThought",
};
