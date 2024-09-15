import { Dependencies, defaultDependencies } from "./dependencies";
import { DynamicType, PromptType, NestedObject, Adapter, KVP } from "../../types";
import { COT } from "../../";
import { createPrompt } from "../Prompt";
import { useStore } from "../../store";
import "dotenv/config";

import { LAMBDA } from "../Cybernetics";

export const MODEL =
  process.env.DEFAULT_MODEL || "Meta-Llama-3-8B-Instruct.Q4_0.gguf";
export const ADAPTER = process.env.DEFAULT_ADAPTER || "GPT4ALL";

export const createDynamic = (
  params: Partial<DynamicType> | string,
  context?: NestedObject,
  prompts: Partial<Dependencies> | Array<Record<string, string>> | (string | PromptType | KVP)[] = {},
  overrides: Partial<Dependencies> = {},
): DynamicType => {
  let dynamicParams: Partial<DynamicType>;
  let dynamicOverrides: Partial<Dependencies>;

  if (typeof params === "string") {
    dynamicParams = {
      name: params,
      context: context as NestedObject,
      prompts: prompts as Array<Record<string, string>>,
    };
    dynamicOverrides = overrides;
  } else {
    dynamicParams = params;
    dynamicOverrides = prompts as Partial<Dependencies>;
  }

  const dynamicDependencies: Dependencies = {
    ...defaultDependencies,
    ...dynamicOverrides,
  };

  const { setContext } = useStore.getState();
  setContext(context ?? dynamicParams.context);

  const instantiatedPrompts: PromptType[] =
    // @ts-ignore
    dynamicParams?.prompts?.map((prompt: string | PromptType | KVP) => {
      if (typeof prompt === "string") {
        return createPrompt({ name: LAMBDA, content: prompt, model: dynamicParams.model || MODEL, adapter: dynamicParams.adapter || (ADAPTER as Adapter) });
      } else if (typeof prompt === "object" && prompt?.content) {
        return createPrompt({
          model: dynamicParams.model || MODEL,
          adapter: dynamicParams.adapter || (ADAPTER as Adapter),
          ...prompt,
        });
      } else {
        return createPrompt({
          model: dynamicParams.model || MODEL,
          adapter: dynamicParams.adapter || (ADAPTER as Adapter),
          name: Object.keys(prompt)[0],
          content: Object.values(prompt)[0] as string,
        });
      }
    }) || [];

  return {
    kind: dynamicParams.kind ?? COT,
    name: dynamicParams.name ?? "defaultDynamic",
    model: dynamicParams.model ?? MODEL,
    adapter: dynamicParams.adapter ?? (ADAPTER as Adapter),
    ...dynamicParams,
    prompts: instantiatedPrompts,
    run: function (initialState) {
      return dynamicDependencies.run(
        initialState || {},
        this as unknown as DynamicType,
      );
    },
    before: dynamicParams.before || dynamicDependencies.before,
    after: dynamicParams.after || dynamicDependencies.after,
  };
};

const Dynamic = (
  params: DynamicType | string,
  context: NestedObject = {},
  prompts: (KVP | string | PromptType)[] = [],
  overrides: Partial<Dependencies> = {},
) => createDynamic(params, context, prompts, overrides);

export default Dynamic;
