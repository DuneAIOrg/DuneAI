import { Dependencies, defaultDependencies } from "./dependencies";
import { DynamicType, PromptType, NestedObject } from "../../types";
import { createPrompt } from "../Prompt";
import { useStore } from "../../store";

export const createDynamic = (
  params: Partial<DynamicType> | string,
  context?: NestedObject,
  prompts: Partial<Dependencies> | Array<Record<string, string>> = {},
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
    dynamicParams?.prompts?.map((prompt) => {
      if ("name" in prompt && "content" in prompt) {
        return prompt as PromptType;
      } else {
        const key = Object.keys(prompt)[0];
        const value = (prompt as Record<string, string>)[key];
        return createPrompt({ name: key, content: value });
      }
    }) || [];

  return Object.freeze({
    kind: dynamicParams.kind ?? "chainOfThought",
    name: dynamicParams.name ?? "defaultDynamic",
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
  });
};

const Dynamic = (
  params: DynamicType | string,
  context: NestedObject = {},
  prompts: Array<Record<string, string>> | Partial<Dependencies> = {},
  overrides: Partial<Dependencies> = {},
) => createDynamic(params, context, prompts, overrides);

export default Dynamic;
