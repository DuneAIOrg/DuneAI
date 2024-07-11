import * as gpt from "gpt4all";
import { throttledOperation } from "../utils/throttling";
import { MODELS } from "./";
import type { AIModel } from "../types";

// Optional interface for completion options
interface CompletionOptions {
  model: AIModel;
  verbose?: boolean;
  device?: string;
}

// Placeholder for model type (could be more specific based on the library)
type ModelType = any;

// Load or get the already loaded model
async function getModel(
  modelPath: string,
  device: string = "cpu",
): Promise<ModelType> {
  let model: ModelType | null = null;
  try {
    model = await gpt.loadModel(modelPath, { device });
    console.log("Model loaded successfully:", modelPath);
  } catch (error) {
    console.error("Failed to load model:", error);
    throw error;
  }
  return model;
}

const getCompletion = async (content: string, options: CompletionOptions) => {
  // @ts-ignore
  const modelPath = options.model;
  const modelInstance = await getModel(modelPath, options.device || "cpu");
  const chat = await modelInstance.createChatSession();
  try {
    const completion = await gpt.createCompletion(chat, content, options);
    disposeModel(modelInstance, modelPath);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error during completion:", error);
    disposeModel(modelInstance, modelPath);
    throw error;
  }
};

export const ask = async (
  prompt: string | Record<string, any>,
  options: CompletionOptions,
): Promise<string> => {
  return (await throttledOperation(
    () => getCompletion(prompt as string, options),
    {
      id: prompt,
    },
  )) as string;
};

export const disposeModel = (model: ModelType, name: string): void => {
  if (model) {
    model.dispose();
    console.log(`Model instance for ${name} disposed`);
  }
};
