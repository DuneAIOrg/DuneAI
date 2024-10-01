import Providers from './providers'
import { throttle } from './throttle'

const DEFAULT_ADAPTER = process.env.DEFAULT_ADAPTER || 'openai';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

// Unified ask method that delegates to the correct adapter based on the modelKey.
// Also applies throttle that reflects env variable settings.
export const ask = async (
  prompt: string | Record<string, any>,
  adapterName: string = DEFAULT_ADAPTER,
  modelName: string = DEFAULT_MODEL,
  options?: any
) => {
  const adapter = Providers[adapterName as keyof typeof Providers];
  if (typeof adapter !== 'function') {
    throw new TypeError(`Adapter ${adapterName} is not valid, here are the available adapters: ${Object.keys(Providers).join(', ')}`);
  }
  const randomId = Math.floor(Math.random() * 1000000);
  return await throttle(
    () => adapter(prompt, { model: modelName, ...options }),
    { id: `ask_operation_${randomId}` }
  );
};
