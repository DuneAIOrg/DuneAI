import { SayHelloWorld } from "./dynamics";

(async () => {
  const result = await SayHelloWorld.run();
  console.log(JSON.stringify(result, null, 2), "\n");
})();
