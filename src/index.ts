import { importPrompts } from "./modules/Prompt";
import { createDynamic } from "./modules/Dynamic";
import { TOT, COT } from "./modules/constants";

export {
  createDynamic,
  importPrompts,
  TOT,
  COT,
};

export default {
  createDynamic,
  importPrompts,
  TOT,
  ToT: TOT,
  COT,
  CoT: COT,
};
