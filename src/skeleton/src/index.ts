import { SayHelloWorld } from "./dynamics";

(async () => {
  const result = await SayHelloWorld.run();
  const values = Object.values(result);
  values.forEach((v) => console.log(v, "\n"));
})();
