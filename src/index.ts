import { importPrompts } from "./modules/Prompt";
import { createDynamic } from "./modules/Dynamic";
import { Accumulator, Inverter, Selector } from "./modules/Cybernetics";
import { TOT, COT } from "./modules/constants";
import {
  PromptParamsType,
  LifecycleHookType,
  KeyValuePair,
  NestedObjectType,
  DynamicOptionsParamType,
  SelectorOptionsType,
  SelectorParamsType,
  SpiceType,
  MetaType,
  DynamicState,
  PromptType,
  DynamicType,
  SelectorType
} from "./modules/types";

export {
  createDynamic,
  importPrompts,
  Selector,
  Accumulator,
  Inverter,
  TOT,
  COT,
  PromptParamsType,
  LifecycleHookType,
  KeyValuePair,
  NestedObjectType,
  DynamicOptionsParamType,
  SelectorOptionsType,
  SelectorParamsType,
  SpiceType,
  MetaType,
  DynamicState,
  PromptType,
  DynamicType,
  SelectorType
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
