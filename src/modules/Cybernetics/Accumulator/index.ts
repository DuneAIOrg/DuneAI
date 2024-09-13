import { PromptType, KVP } from "../../../types";
import { createPrompt } from "../../Prompt";
import { createDynamic } from "../../Dynamic";

import { BaseCybernetic, Cybernetic, LAMBDA } from "../index";

const DEFAULT_DELIMITER = ",";

const replicate = true;
const aggregate = true;
const distribute = true;

const distributeFeedback = (data: string) => `
Convert the following string into a format that can be parsed as a JavaScript array: ${data}
Return the array as a string that can be safely parsed.`;

const aggregateFeedback = (data: string) => `
Convert the following string into a format that can be parsed as a JavaScript array: ${data}
Return the array as a string that can be safely parsed.`;

interface OptionsType {
  state?: KVP;
  context?: KVP;
  feedback?: string;
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
  prompt: PromptType | KVP | string,
  replicate: number | ((context?: KVP, state?: KVP) => number),
  context?: KVP,
  state?: KVP,
): Array<Partial<PromptType>> => {
  let replicateCount: number = 0;
  const promptName = pickName(prompt);
  const promptContent = pickContent(prompt);
  const promptObject = typeof prompt === "object" 
    ? prompt 
    : { [promptName || LAMBDA]: promptContent };

  if (typeof replicate === "function") {
    replicateCount = replicate(context, state);
  } else if (typeof replicate === "number") {
    replicateCount = replicate;
  }

  const result = Array(replicateCount)
    .fill(promptObject)
    .map((_, key) => {
      const newKey = `${promptName}_${key}`;
      return {
          ...promptObject,
          name: newKey,
          content: promptContent || '',
          spice: {
            iteration: key,
          }
      };
    });
  return result;
};

// an array split by a supplied delemeter.
// const performDistribute = (completion, distribute, context, state) => {
//   let distributeDelimiter: number = 0;
//   if (typeof distribute === "function") {
//     distributeDelimiter = distribute(context, state);
//   } else if (typeof distribute === "string") {
//     distributeDelimiter = distribute;
//   } else if (distribute === true) {
//     distributeDelimiter = DEFAULT_DELIMITER;
//   }
//   return completion.split(distributeDelimiter);
//   return Array(distributeCount)
//     .fill(prompt)
//     .map((prompt, key) => ({ [key]: prompt }));
// };

//
// const performAggregate = (completions, aggregate, context, state) => {
//   return completions.join(",");
// };

// Changes string into an array and then back into a sorted list as an array
// Accumulator('colors: 1) blue, 2) orange, 3) red', { distribute, aggregate })
// returns: blue, orange, red
export const Accumulator = (
  prompt: string | KVP | PromptType,
  options: OptionsType,
): ((string | KVP | PromptType)[] | Promise<(string | KVP | PromptType)[]>) => {
  let replicateCount: number = 0;
  let distributeCount: number = 0;

  let prompts: (PromptType)[];
  let completions: string[];
  let completion: string[] | string;

  const { replicate, aggregate, distribute, feedback, context, state } =
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
    ? performReplicate(prompt, replicate, context, state) as PromptType[]
    : [prompt as PromptType];

  // const AccumulatorCybernetic = createDynamic({
  //   name: "AccumulatorCybernetic",
  //   context,
  //   prompts,
  // });

  // const result = await AccumulatorCybernetic.run(state);
  // completions = result.state.AccumulatorCybernetic;

  // completion = aggregate
  //   ? performAggregate(completions, aggregate, context, state)
  //   : completions;

  // completions =
  //   distribute && performDistribute(prompt, distribute, context, state);

  return prompts;
};
