import Mustache from "mustache";
import { PromptType, DynamicType } from "../../types";
import { ask } from "../../adapters";
import { useStore } from "../../store";
import { interpolateIteration } from "../../utils";

export interface FunctionTypes {
  run: (prompt: PromptType, dynamic: DynamicType) => Promise<string>;
}

export interface Constants {}

export interface Dependencies extends FunctionTypes, Constants {}

export const defaultDependencies: Dependencies = {
  async run(prompt, dynamic) {
    const data = useStore.getState();

    // @ts-ignore
    const iterationValue = prompt.iteratable?.iterationValue || 0;
    // @ts-ignore
    const iteration = prompt.iteratable?.iteration || -1;

    const promptWithIteration =
      (iteration &&
        interpolateIteration(prompt.content, {
          iteration,
          iterationValue,
        })) ||
      prompt.content;

    const interpolatedContent = Mustache.render(promptWithIteration as string, {
      ...{
        context: data.context,
        ...data.generations,
      },
      generationName: `${dynamic.name}.${prompt.name}`,
      iterationValue,
      iteration,
    });

    // console.log(`Invoking Prompt: ${prompt.name}`);
    const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;
    return aiResponse;
  },
};
