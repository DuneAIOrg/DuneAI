import { SayHelloWorld } from "./dynamics";

(async () => {
  console.log("Starting");
  // const { SayHelloWorld } = await import("./dynamics");
  const result = await (await SayHelloWorld()).run();
  console.log(JSON.stringify(result, null, 2), "\n");
})();
