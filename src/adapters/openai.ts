import OpenAI from "openai";
import { throttledOperation } from "../utils/throttling";
import "dotenv/config";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getCompletion = async (content: string, options: {}) => {
  const params = {
    messages: [{ role: "user", content }],
    ...options,
  };
  // @ts-ignore
  const { adapter: _, ...openaiParams } = params;
  // @ts-ignore
  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(
      openaiParams as OpenAI.Chat.ChatCompletionCreateParams,
    );
  return chatCompletion.choices[0].message?.content;
};

export const ask = async (
  prompt: string | Record<string, any>,
  options?: any,
) => {
  return (await throttledOperation(
    () => getCompletion(prompt as string, options),
    {
      id: prompt,
    },
  )) as string;
};
