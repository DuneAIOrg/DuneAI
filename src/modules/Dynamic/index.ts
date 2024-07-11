import { Dependencies, defaultDependencies } from "./dependencies";
import { DynamicType, PromptType } from "../../types";
import Prompt from "../Prompt";
import { useStore } from "../../store";

export const createDynamic = (
  params: Partial<DynamicType>,
  overrides: Partial<Dependencies> = {},
): DynamicType => {
  const dynamicDependencies: Dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const { getState } = useStore;
  const { setContext } = getState();
  setContext(params.context);

  const instantiatedPrompts: PromptType[] | [] =
    params?.prompts?.map((prompt) => {
      if ("name" in prompt && "content" in prompt) {
        return prompt as PromptType;
      } else {
        const key = Object.keys(prompt)[0];
        const value = prompt[key];
        return Prompt().create({ name: key, content: value });
      }
    }) || [];

  // @ts-ignore
  return Object.freeze({
    kind: "chainOfThought",
    ...params,
    prompts: instantiatedPrompts,
    run: function () {
      return dynamicDependencies.run(this as unknown as DynamicType);
    },
    beforeLife: dynamicDependencies.beforeLife,
    afterDeath: dynamicDependencies.afterDeath,
  });
};

const Dynamic = (params: DynamicType, overrides: Partial<Dependencies> = {}) =>
  createDynamic(params, overrides);

export default Dynamic;
