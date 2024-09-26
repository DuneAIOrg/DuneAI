import "dotenv/config";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'openai_api_key';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

const getCompletion = async (content: string, options: { model?: string }) => {
  const params = {
    messages: [{ role: "user", content }],
    model: options.model || DEFAULT_MODEL,
    ...options,
  };
  // @ts-ignore
  const { adapter: _, ...openaiParams } = params;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(openaiParams),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const chatCompletion = await response.json();
  return {
    content: chatCompletion.choices[0].message?.content,
    meta: chatCompletion
  };
};

export const ask = async (
  prompt: string | Record<string, any>,
  options?: any,
) => {
  const result = await getCompletion(prompt as string, options);
  return { content: result.content, meta: result.meta };
};
