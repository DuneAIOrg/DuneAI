import { Accumulator } from "./Accumulator";
import { Selector } from "./Selector";
import { Inverter } from "./Inverter";
// import { ThinkingMachine } from "./ThinkingMachine";

const LAMBDA = "λ";

// // Define the base Cybernetic type with shared attributes and methods
// export interface Cybernetic {
//   prompt: string;
//   options: Record<string, unknown>;
// }

// // Base cybernetic function that could be extended or used for shared functionality
// export const BaseCybernetic = (
//   prompt: string,
//   options: Record<string, unknown>,
// ): Cybernetic => ({
//   prompt,
//   options,
// });

// Export all cybernetics for use elsewhere in the application
export { Selector, Accumulator, Inverter, LAMBDA }; //, Inverter, ThinkingMachine };