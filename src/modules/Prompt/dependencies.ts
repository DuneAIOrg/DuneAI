import path from "path";
import fs from "fs";
import Mustache from "mustache";

import { PromptType, DynamicState, SpiceType } from "../types";
import { LAMBDA } from "../constants";
import { ask } from "../../adapters";
import { countTokens } from "../../utils";
import Logger from "../../middleware/logger";

const interpolateSpice = (prompt: PromptType): PromptType => {
  const iterationValue = prompt.spice?.iterationValue || "";
  const iteration = prompt.spice?.iteration || -1;

  const promptWithIteration = interpolateIteration(prompt.content, {
    iteration,
    iterationValue,
  });

  return {
    ...prompt,
    content: promptWithIteration,
  };
}

// @ts-ignore
export const interpolateIteration = function (content, params) {
  const keys = Object.keys(params);
  const values = Object.values(params);
  return new Function(...keys, `return \`${content}\`;`)(...values);
};

const preApplySpice = (prompt: PromptType): PromptType => {
  const startedAt = new Date();
  const currentTime = new Date();
  const seed = Math.random();
  return {
    ...prompt,
    spice: {
      // possible iteration info 
      // is passed with the prompt
      ...prompt.spice,
      currentTime,
      startedAt,
      seed,
    },
  };
}

const postApplySpice = (prompt: PromptType, info: object): PromptType => {
  const finishedAt = new Date();
  const duration = finishedAt.getTime() - prompt.spice.startedAt.getTime();
  return {
    ...prompt,
    spice: {
      ...prompt.spice,
      finishedAt,
      duration,
      modelUsed: prompt.model,
      adapterUsed: prompt.adapter,
      ...info
    },
  };
}

const interpolateState = (prompt: PromptType, state: DynamicState): PromptType => {
  const content = Mustache.render(prompt.content as string, {
    ...state,
    ...{
      C: state.context,
      Context: state.context,
    },
  });
  return {
    ...prompt,
    content,
  };
}

const run = async(prompt: PromptType, state: DynamicState) => {
  let runningPrompt: PromptType = prompt;
  runningPrompt = preApplySpice(runningPrompt);
  runningPrompt = interpolateSpice(runningPrompt);
  runningPrompt = interpolateState(runningPrompt, state);

  const { tokenCount: sentTokenCount, modelUsed: sentModelUsed } =
    countTokens(runningPrompt.content, prompt.model as string);
  Logger.info(
    `Invoking Prompt ${prompt.name}, ${sentTokenCount} tokens sent (${sentModelUsed})`,
  );

  const aiResponse = (await ask(runningPrompt.content, prompt.model as string, {
    adapter: prompt.adapter,
  })) as string;

  const { tokenCount: responseTokenCount, modelUsed: responseModelUsed } =
    countTokens(aiResponse, prompt.model as string);
  Logger.info(
    `Completed Prompt ${prompt.name}, ${responseTokenCount} tokens received (${responseModelUsed}) in ${prompt.spice.duration}ms`,
  );


  runningPrompt = postApplySpice(runningPrompt);

  return completedPrompt
}

const importPrompt = (filePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolutePath, "utf8");
};

const parsePromptsFromFile = (
  content: string,
): Record<string, string> => {
  const prompts: Record<string, string> = {};
  const sections = content.split(/^#\s*(\w+)/gm);

  for (let i = 1; i < sections.length; i += 2) {
    const name = sections[i];
    const promptContent = sections[i + 1].trim();
    prompts[name] = promptContent;
  }

  return prompts;
};

export const run = async(prompt: PromptType) => {

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
}

export const importPrompts = (
  dirOrFilePath: string,
): Record<string, string> => {
  const absolutePath = path.resolve(process.cwd(), dirOrFilePath);

  if (fs.lstatSync(absolutePath).isDirectory()) {
    const prompts: Record<string, string> = {};
    const filePaths = fs
      .readdirSync(absolutePath)
      .filter((file) => file.endsWith(".prompt"));

    filePaths.forEach((filePath) => {
      const fileName = path.basename(filePath, path.extname(filePath));
      prompts[fileName] = importPrompt(path.join(absolutePath, filePath));
    });

    return prompts;
  } else {
    const content = importPrompt(absolutePath);
    return parsePromptsFromFile(content);
  }
};


export const stringToPrompt = (
  content: string
): Partial<PromptType> => {
  return {
    name: LAMBDA,
    content,
  } as Partial<PromptType>;
}

export const keyValuePairToPrompt = (
  name: string, 
  content: string
): Partial<PromptType> => {
  return {
    name,
    content,
  } as Partial<PromptType>;
}