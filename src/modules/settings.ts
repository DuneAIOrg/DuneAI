// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();

export const getSettings = () => ({
  model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
  adapter: process.env.DEFAULT_ADAPTER || "openai",
  maxLogLength: process.env.MAX_LOG_LENGTH || '25',
});
