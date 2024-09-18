import { PromptType, PromptParamsType } from "../types";
import { getSettings } from "../settings";
import { 
  run, 
  importPrompts, 
  stringToPrompt, 
  keyValuePairToPrompt 
} from "./dependencies";
  
const createPrompt = async(
  params: PromptParamsType
): Promise<PromptType> => {
  let newPrompt: Partial<PromptType>;

  if (typeof params === 'function') {
    return createPrompt(await params());
  } else {
    if (typeof params === 'string') {
      newPrompt = stringToPrompt(params as string);
    } else if (typeof params === 'object' && !params?.name) {
      const [name, content] = Object.entries(params)[0];
      newPrompt = keyValuePairToPrompt(name, content);
    } else if (typeof params === 'object') {
      newPrompt = params as Partial<PromptType>;
    } else {
      throw new Error('Invalid prompt params');
    }
  }

  return {
    ...getSettings(),
    ...newPrompt,
    run: () => run(newPrompt as PromptType)
  } as PromptType;
}

export { importPrompts, createPrompt };
