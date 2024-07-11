import * as gpt4all from "./gpt4all";
import * as openai from "./openai";
import * as sdwebui from "./sdwebui";

export const ADAPTERS = {
  GPT4ALL: gpt4all,
  OPENAI: openai,
  SDWEBUI: sdwebui,
};

export const MODELS = {
  GPT_FOUR: { model: "gpt-4o", adapter: "OPENAI" },
  GPT_FOUR_BIG: { model: "gpt-4-32k", adapter: "OPENAI" },
  GPT_THREE: { model: "gpt-3.5-turbo", adapter: "OPENAI" },
  MISTRAL_7B: {
    model: "mistral-7b-openorca.gguf2.Q4_0.gguf",
    adapter: "GPT4ALL",
  },
  ORCA_MINI_3B: { model: "orca-mini-3b-gguf2-q4_0.gguf", adapter: "GPT4ALL" },
  NOUS_HERMES: {
    model: "Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf",
    adapter: "GPT4ALL",
  },
  LLAMA3XXX: {
    model: "LexiFun-Llama-3-8B-Uncensored-V1_F16.gguf",
    adapter: "GPT4ALL",
  },
  LLAMA3: {
    model: "Meta-Llama-3-8B-Instruct.Q4_0.gguf",
    adapter: "GPT4ALL",
  },
  SD: { model: "sd", adapter: "SDWEBUI" },
} as const;

// Unified ask method that delegates to the correct adapter based on the modelKey
export async function ask(
  prompt: string | Record<string, any>,
  modelKey: keyof typeof MODELS,
  options?: any,
) {
  const adapterKey = MODELS[modelKey].adapter;
  const model = MODELS[modelKey].model;
  const adapter = ADAPTERS[adapterKey];
  return adapter.ask(prompt, { model, ...options });
}
