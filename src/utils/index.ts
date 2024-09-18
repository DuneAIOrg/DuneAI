import tiktoken, { type TiktokenModel } from "tiktoken";

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const retryOperation = (
  operation: any,
  delay: number,
  retries: number,
) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason: string) => {
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export const shuffle = (array: string[][]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const attemptObjectification = (content: string) => {
  // check if the object can be objectified
};

export const objectify = (content: string) => {
  // check if the content string is a valid json object,
  // if so, return it as a js object
};

export const countTokens = (
  content: string,
  model: string,
): { modelUsed: string; tokenCount: number } => {
  let enc;
  let tokenCount;
  let modelUsed = model;
  try {
    enc = tiktoken.encoding_for_model(model as TiktokenModel);
    tokenCount = enc.encode(content).length;
  } catch {
    modelUsed = "gpt-4o";
    enc = tiktoken.encoding_for_model(modelUsed as TiktokenModel);
    tokenCount = enc.encode(content).length;
  } finally {
    enc?.free();
  }
  return {
    modelUsed,
    tokenCount,
  };
};
