import Mustache from "mustache";
import { PromptType } from "../../types";
import { ask } from "../../adapters";
import { interpolateIteration } from "../../utils";

export interface FunctionTypes {
  run: (prompt: PromptType, state: Record<string, any>) => Promise<string>;
}

export interface Constants {}

export interface Dependencies extends FunctionTypes, Constants {}

export const defaultDependencies: Dependencies = {
  async run(prompt, state) {
    const iterationValue = prompt.spice?.iterationValue || "";
    const iteration = prompt.spice?.iteration || -1;

    const promptWithIteration =
      (iteration &&
        interpolateIteration(prompt.content, {
          iteration,
          iterationValue,
        })) ||
      prompt.content;

    const interpolatedContent = Mustache.render(promptWithIteration as string, {
      ...state,
      iterationValue,
      iteration,
    });

    console.log(`Invoking Prompt: ${prompt.name}`);
    const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;

    return aiResponse;
  },
};
