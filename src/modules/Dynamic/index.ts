import { run } from "./dependencies";
import { COT, TOT, LAMBDA } from "../constants";
import { 
  DynamicType, 
  NestedObjectType, 
  PromptParamsType, 
  DynamicOptionsParamType, 
  DynamicState
} from "../types";

export const createDynamic = (
  options: DynamicOptionsParamType | string,
  context?: NestedObjectType,
  prompts?: Array<PromptParamsType>,
  overrides?: Partial<PromptParamsType>
): DynamicType => {
  let newDynamic: DynamicType;

  if (typeof options === "string") {
    newDynamic = {
      name: options as string,
      kind: COT,
      context: context as NestedObjectType,
      prompts: prompts as Array<PromptParamsType>,
    } as DynamicType;
  } else if (typeof options === "object") {
    newDynamic = {
      name: options.name ?? LAMBDA,
      kind: options.kind === TOT ? TOT : COT,
      context: options.context as NestedObjectType,
      prompts: options.prompts as Array<PromptParamsType>,
      before: options.before,
      after: options.after,
    } as DynamicType;
  } else {
    throw new Error("Invalid dynamic params");
  }

  return {
    ...newDynamic,
    overrides: overrides ?? overrides,
    run: (initialState: Partial<DynamicState>): Promise<Partial<DynamicState>> => 
      run(initialState, newDynamic),
  }
}
