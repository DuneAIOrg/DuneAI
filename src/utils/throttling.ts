import Bottleneck from "bottleneck";
import { retryOperation } from "./";

export const DELAY = 500;
export const RETRY_COUNT = 3;
export const MAX_CONCURRENT = 5;

// Setup for the bottleneck limiter
const limiter = new Bottleneck({
  minTime: DELAY,
  maxConcurrent: MAX_CONCURRENT,
});

// Generalized function to perform throttled operations with retries
export const throttledOperation = async (
  operation: () => Promise<any>,
  options?: any,
) => {
  return await limiter.schedule(
    () => retryOperation(operation, DELAY, RETRY_COUNT),
    {
      priority: 1,
      weight: 1,
      id: options?.id || "default_id",
    },
  );
};
