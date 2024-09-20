import { SayHelloWorld } from "./dynamics";
import { Selector } from "../../modules/Cybernetics";

(async () => {
  // const result = await SayHelloWorld.run({ seed: 523452345235 });
  const result2 = await Selector({
    completions: ["hello", "world", "this", "is", "a", "test", "hi"],
    criteria: "is a greeting",
    options: { greedy: false }
  });
  console.log(result2);
})();
