import { Dependencies, defaultDependencies } from "./dependencies";
import { DynamicType, PromptType } from "../../types";
import { createPrompt } from "../Prompt";
import { useStore } from "../../store";

export const createDynamic = (
  params: Partial<DynamicType> | string,
  promptsOrOverrides:
    | Partial<Dependencies>
    | Array<Record<string, string>> = {},
  overrides: Partial<Dependencies> = {},
): DynamicType => {
  let dynamicParams: Partial<DynamicType>;
  let dynamicOverrides: Partial<Dependencies>;

  if (typeof params === "string") {
    dynamicParams = {
      name: params,
      prompts: promptsOrOverrides as Array<Record<string, string>>,
    };
    dynamicOverrides = overrides;
  } else {
    dynamicParams = params;
    dynamicOverrides = promptsOrOverrides as Partial<Dependencies>;
  }

  const dynamicDependencies: Dependencies = {
    ...defaultDependencies,
    ...dynamicOverrides,
  };

  const { getState } = useStore;
  const { setContext } = getState();
  setContext(dynamicParams.context);

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
  promptsOrOverrides:
    | Partial<Dependencies>
    | Array<Record<string, string>> = {},
  overrides: Partial<Dependencies> = {},
) => createDynamic(params, promptsOrOverrides, overrides);

export default Dynamic;
