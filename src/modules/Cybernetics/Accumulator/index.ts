import { PromptType, KVP } from "../../../types";
import { createPrompt } from "../../Prompt";
import { createDynamic } from "../../Dynamic";

import { BaseCybernetic, Cybernetic, LAMBDA } from "../index";

const DEFAULT_DELIMITER = ",";

interface OptionsType {
  state?: KVP;
  context?: KVP;
  feedback?: string;
  completion?: string;
  aggregate?: string | ((context?: KVP, state?: KVP) => string);
  replicate?: number | ((context?: KVP, state?: KVP) => number);
  distribute?: string | ((context?: KVP, state?: KVP) => string);
}

const pickName = (prompt: KVP | PromptType | string): string | false =>
  typeof prompt === "object" && "name" in prompt
    ? prompt?.name || false
    : typeof prompt === "object"
      ? Object.entries(prompt)?.[0]?.[0] || false
      : LAMBDA;

const pickContent = (prompt: KVP | PromptType | string): string | false =>
  // @ts-ignore
  typeof prompt === "object" && "content" in prompt
    ? prompt?.content || false
    : typeof prompt === "object"
      ? Object.entries(prompt)?.[0]?.[1] || false
      : false;

const performReplicate = (
  prompts: (PromptType | KVP | string)[],
  replicate: number | ((context?: KVP, state?: KVP) => number),
  context?: KVP,
  state?: KVP,
): Array<Partial<PromptType>> => {
  let replicateCount: number = 0;

  if (typeof replicate === "function") {
    replicateCount = replicate(context, state);
  } else if (typeof replicate === "number") {
    replicateCount = replicate;
  }

  const result: Array<Partial<PromptType>> = [];

  prompts.forEach((prompt) => {
    const promptName = pickName(prompt);
    const promptContent = pickContent(prompt);
    const promptObject = typeof prompt === "object"
      ? prompt
      : { [promptName || LAMBDA]: promptContent };

    for (let i = 0; i < replicateCount; i++) {
      const newKey = `${promptName}_${i}`;
      result.push({
        ...promptObject,
        name: newKey,
        content: promptContent || '',
        spice: {
          iteration: i,
        }
      });
    }
  });

  return result;
};

// an array split by a supplied delemeter.
const performDistribute = (
  completion: string,
  distribute: string | boolean | ((context?: KVP, state?: KVP) => string),
  context?: KVP,
  state?: KVP,
): Array<string> => {
  let distributeDelimiter: string = DEFAULT_DELIMITER;
  if (typeof distribute === "function") {
    distributeDelimiter = distribute(context, state);
  } else if (typeof distribute === "string") {
    distributeDelimiter = distribute;
  } else if (distribute === true) {
    distributeDelimiter = DEFAULT_DELIMITER;
  }
  return completion.split(distributeDelimiter);
};

const performAggregate = (
  completions: string[],
  aggregate: string | boolean | ((context?: KVP, state?: KVP) => string),
  context?: KVP,
  state?: KVP,
): string => {
  let aggregateDelimiter: string = DEFAULT_DELIMITER;
  if (typeof aggregate === "function") {
    aggregateDelimiter = aggregate(context, state);
  } else if (typeof aggregate === "string") {
    aggregateDelimiter = aggregate;
  } else if (aggregate === true) {
    aggregateDelimiter = DEFAULT_DELIMITER;
  }
  return completions.join(aggregateDelimiter);
};

// Changes string into an array and then back into a sorted list as an array
// Accumulator('colors: 1) blue, 2) orange, 3) red', { distribute, aggregate })
// returns: blue, orange, red
export const Accumulator = (
  basePrompts: (string | KVP | PromptType)[],
  options: OptionsType,
): string | string[] | PromptType[] => {

  let prompts: (string | KVP | PromptType)[] = [...basePrompts];
  let completion: string | string[] = options.completion || '';
  let completions: string | string[];

  const { replicate, aggregate, distribute, context, state } =
    options;

  // valid combos:
  // replicate: true  | replicate: false | replicate: false
  // aggregate: true  | aggregate: true  | aggregate: false
  // distribute: true | distribute: true | distribute: true
  //
  // invalid combo (can't do this, replacate creates array and distribute can't consume that)
  // replicate: true
  // aggregate: false
  // distribute: true

  prompts = replicate
    ? performReplicate(prompts, replicate, context, state) as PromptType[]
    : prompts;

  completions = distribute
    ? performDistribute(completion, distribute, context, state)
    : [completion as string];

  completion = aggregate
    ? performAggregate(completions, aggregate, context, state)
    : completions;

  if(completions[0] !== '') {
    return completions as string[];
  }

  if(completion !== '' && completion[0] !== '') {
    return completion as string;
  }

  return prompts as PromptType[];
};