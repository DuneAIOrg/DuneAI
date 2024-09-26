import { importPrompts } from "./modules/Prompt";
import { createDynamic } from "./modules/Dynamic";
import { Accumulator, Inverter, Selector } from "./modules/Cybernetics";
import { TOT, COT, LAMBDA } from "./modules/constants";
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

export type {
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
}

const moduleExports = {
  createDynamic,
  importPrompts,
  Selector,
  Accumulator,
  Inverter,
  TOT,
  ToT: TOT,
  COT,
  CoT: COT,
  LAMBDA
}

export default moduleExports;
