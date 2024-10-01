import "dotenv/config";
import {CompletionResult, createCompletion, loadModel} from "gpt4all";
import {resolve} from "node:path";
import process from "node:process";

export type GetCompletionOptions = {
  useLocalSession: false;
  model: string;
  host?: string;
  protocol?: 'http' | 'https';
  port?: number;
  max_tokens?: number;
  temperature?: number;
} | {
  useLocalSession: true
  model: string;
  modelPath?: string;
}

const getBaseUrl = (options?: GetCompletionOptions) => {
  if (options && options.useLocalSession) {
    return
  }

   const url = new URL('http://localhost:4891');
   if (options?.host) {
     url.host = options.host;
   }

    if (options?.protocol) {
      url.protocol = options.protocol;
    }

    if (options?.port) {
      url.port = options.port.toString();
    }

    return url.toString();
}

const getCompletion = async (content: string, options?: GetCompletionOptions) => {
  const params = {
    max_tokens: options?.useLocalSession ? 512 : options?.max_tokens ?? 512,
    temperature: options?.useLocalSession ? 0.24 : options?.temperature ?? 0.24,
    ...options,
  };

  // @ts-expect-error
  const { adapter: _, ...gpt4allParams } = params;

  const apiBaseUrl = getBaseUrl(options);

  let completion: CompletionResult

  if (options?.useLocalSession) {
    const model = await loadModel(options.model, {
      nCtx: 32_000,
      modelPath: resolve(process.cwd(), options.modelPath ?? 'models'),
    })

    const session = await model.createChatSession({
      nCtx: 32_000,
      temperature: gpt4allParams.temperature
    })

    completion = await createCompletion(session, content, {
      nCtx: 32_000,
    })
  } else {
    const response = await fetch(apiBaseUrl + 'v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(gpt4allParams),
    });

    if (!response.ok) {
      throw new Error(`GTP4All API error: ${response.statusText}`);
    }

    completion = await response.json();
  }

  return {
    content: completion?.choices?.[0]?.message?.content ?? '',
    meta: completion
  };
};

export const ask = async (
  prompt: string | Record<string, any>,
  options?: GetCompletionOptions,
) => {
  const result = await getCompletion(prompt as string, options);
  return { content: result.content, meta: result.meta };
};
