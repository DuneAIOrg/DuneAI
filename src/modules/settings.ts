export const getSettings = () => ({
  model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
  adapter: process.env.DEFAULT_ADAPTER || "openai",
});
