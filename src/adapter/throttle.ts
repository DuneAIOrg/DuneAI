import { retryOperation } from "../utils";
import "dotenv/config";

export const DELAY = parseInt(process.env.DELAY || '500', 10);
export const RETRY_COUNT = parseInt(process.env.RETRY_COUNT || '3', 10);
export const MAX_RPM = parseInt(process.env.MAX_RPM || '10000', 10);
export const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT || MAX_RPM.toString(), 10);

let currentConcurrent = 0;
const queue: { operation: () => Promise<any>; resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = async () => {
  if (queue.length === 0 || currentConcurrent >= MAX_CONCURRENT) {
    return;
  }

  const { operation, resolve, reject } = queue.shift()!;
  currentConcurrent++;

  try {
    const result = await retryOperation(operation, DELAY, RETRY_COUNT);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    currentConcurrent--;
    setTimeout(processQueue, 60000 / MAX_RPM);
  }
};

// Generalized function to perform throttled operations with retries
export const throttle = async (
  operation: () => Promise<any>,
  options?: any,
) => {
  return new Promise((resolve, reject) => {
    queue.push({ operation, resolve, reject });
    processQueue();
  });
};
