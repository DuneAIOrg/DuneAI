import Mustache from "mustache";
import { PromptType } from "../../types";
import { ask } from "../../adapters";
import { interpolateIteration, countTokens } from "../../utils";
import Logger from "../../middleware/logger";

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
      ...{
        C: state.context,
        Context: state.context,
      },
      iterationValue,
      iteration,
    });

    const { tokenCount: sentTokenCount, modelUsed: sentModelUsed } =
      countTokens(interpolatedContent, prompt.model as string);
    Logger.info(
      `Invoking Prompt ${prompt.name}, ${sentTokenCount} tokens sent (${sentModelUsed})`,
    );
    const startTime = Date.now();
    const aiResponse = (await ask(interpolatedContent, prompt.model as string, {
      adapter: prompt.adapter,
    })) as string;
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    const { tokenCount: responseTokenCount, modelUsed: responseModelUsed } =
      countTokens(aiResponse, prompt.model as string);
    Logger.info(
      `Completed Prompt ${prompt.name}, ${responseTokenCount} tokens received (${responseModelUsed}) in ${elapsedTime}ms`,
    );

    return aiResponse;
  },
};
