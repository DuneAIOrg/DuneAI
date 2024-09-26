import { importPrompts as duneaiImportPrompts } from "./modules/Prompt";
import { createDynamic as duneaiCreateDynamic } from "./modules/Dynamic";
import { Accumulator as duneaiAccumulator , Inverter as duneaiInverter, Selector as duneaiSelector } from "./modules/Cybernetics";
import { TOT as duneaiTOT, COT as duneaiCOT, LAMBDA as duneaiLAMBDA } from "./modules/constants";
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

export const createDynamic = duneaiCreateDynamic;
export const importPrompts = duneaiImportPrompts;
export const Selector = duneaiSelector;
export const Accumulator = duneaiAccumulator;
export const Inverter = duneaiInverter;
export const TOT = duneaiTOT;
export const ToT = duneaiTOT;
export const COT = duneaiCOT;
export const CoT = duneaiCOT;
export const LAMBDA = duneaiLAMBDA;

const moduleExports = {
  createDynamic,
  importPrompts,
  Selector,
  Accumulator,
  Inverter,
  TOT,
  ToT,
  COT,
  CoT,
  LAMBDA
}

export default moduleExports;
