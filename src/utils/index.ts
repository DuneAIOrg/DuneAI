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

// @ts-ignore
export const interpolateIteration = function (content, params) {
  const keys = Object.keys(params);
  const values = Object.values(params);
  return new Function(...keys, `return \`${content}\`;`)(...values);
};

export const attemptObjectification = (content: string) => {
  // check if the object can be objectified
};

export const objectify = (content: string) => {
  // check if the content string is a valid json object,
  // if so, return it as a js object
};
