// @ts-ignore
import DuneAI from "duneai";
const { Test } = DuneAI.importPrompts("src/Prompts.prompt");

// Define a dynamic
const dynamic = DuneAI.createDynamic({
  name: "TestDynamic",
  prompts: [{ Test }],
});

(async () => {
  const result = await dynamic.run();
  console.log({ result });
})();
            