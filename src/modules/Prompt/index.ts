import path from "path";
import fs from "fs";
import { PromptType } from "../../types";
import { Dependencies, defaultDependencies } from "./dependencies";

export const createPrompt = (
  params: Partial<PromptType>,
  overrides: Partial<Dependencies> = {},
): PromptType => {
  const promptDependencies: Dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  return Object.freeze({
    name: params.name ?? "defaultPrompt",
    model: params.model,
    adapter: params.adapter ?? "GPT4ALL",
    ...params,
    run: function (state: Record<string, any>) {
      return promptDependencies.run(this as unknown as PromptType, state);
    },
  });
};

const Prompt = (
  params: Partial<PromptType>,
  overrides: Partial<Dependencies> = {},
) => createPrompt(params, overrides);

export default Prompt;

export const importPrompt = (filePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolutePath, "utf8");
};

export const parsePromptsFromFile = (
  content: string,
): Record<string, string> => {
  const prompts: Record<string, string> = {};
  const sections = content.split(/^#\s*(\w+)/gm);

  for (let i = 1; i < sections.length; i += 2) {
    const name = sections[i];
    const promptContent = sections[i + 1].trim();
    prompts[name] = promptContent;
  }

  return prompts;
};

export const importPrompts = (
  dirOrFilePath: string,
): Record<string, string> => {
  const absolutePath = path.resolve(process.cwd(), dirOrFilePath);

  if (fs.lstatSync(absolutePath).isDirectory()) {
    const prompts: Record<string, string> = {};
    const filePaths = fs
      .readdirSync(absolutePath)
      .filter((file) => file.endsWith(".prompt"));

    filePaths.forEach((filePath) => {
      const fileName = path.basename(filePath, path.extname(filePath));
      prompts[fileName] = importPrompt(path.join(absolutePath, filePath));
    });

    return prompts;
  } else {
    const content = importPrompt(absolutePath);
    return parsePromptsFromFile(content);
  }
};
