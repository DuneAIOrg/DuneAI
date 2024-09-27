import "dotenv/config";

export interface GetCompletionOptions {
    model: string;
    host?: string;
    protocol?: 'http' | 'https';
    port?: number;
    max_tokens?: number;
    temperature?: number;
}

const getBaseUrl = (options?: GetCompletionOptions) => {
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
    messages: [{ role: "user", content }],
    max_tokens: options?.max_tokens ?? 512,
    temperature: options?.temperature ?? 0.24,
    ...options,
  };

  // @ts-expect-error
  const { adapter: _, ...gpt4allParams } = params;

  const apiBaseUrl = getBaseUrl(options);

  const response = await fetch(apiBaseUrl + 'v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify(gpt4allParams),
  });

  if (!response.ok) {
    throw new Error(`GTP4All API error: ${response.statusText}`);
  }

  const chatCompletion = await response.json();

  return {
    content: chatCompletion?.choices?.[0]?.message?.content ?? '',
    meta: chatCompletion
  };
};

export const ask = async (
  prompt: string | Record<string, any>,
  options?: GetCompletionOptions,
) => {
  const result = await getCompletion(prompt as string, options);
  return { content: result.content, meta: result.meta };
};
