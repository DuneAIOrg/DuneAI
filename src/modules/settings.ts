import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.OPENAI_API_KEY);


export const getSettings = () => ({
  model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
  adapter: process.env.DEFAULT_ADAPTER || "openai",
});
