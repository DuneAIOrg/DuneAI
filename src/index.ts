import { importPrompts } from "./modules/Prompt";
import { createDynamic } from "./modules/Dynamic";
import { Accumulator, Inverter, Selector } from "./modules/Cybernetics";
import { TOT, COT } from "./modules/constants";

export {
  createDynamic,
  importPrompts,
  Selector,
  Accumulator,
  Inverter,
  TOT,
  COT,
};

export default {
  createDynamic,
  importPrompts,
  Selector,
  Accumulator,
  Inverter,
  TOT,
  ToT: TOT,
  COT,
  CoT: COT,
};
