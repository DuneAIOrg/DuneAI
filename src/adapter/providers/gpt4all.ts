import "dotenv/config";
import { ChatSession, CompletionResult, createCompletion } from "gpt4all";

export type GetCompletionOptions = {
    model: string;
    host?: string;
    protocol?: 'http' | 'https';
    port?: number;
    max_tokens?: number;
    temperature?: number;
} | {
  session: ChatSession
}

const getBaseUrl = (options?: GetCompletionOptions) => {
  if (options && 'session' in options) {
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
  const isSession = options && 'session' in options

  const params = {
    max_tokens: isSession ? 512 : options?.max_tokens ?? 512,
    temperature: isSession ? 0.24 : options?.temperature ?? 0.24,
    ...options,
  };

  // @ts-expect-error
  const { adapter: _, ...gpt4allParams } = params;

  const apiBaseUrl = getBaseUrl(options);

  let completion: CompletionResult

  if (isSession) {
    completion = await createCompletion(options.session, content, {
      tokensSize: gpt4allParams.max_tokens,
      temperature: gpt4allParams.temperature,
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
