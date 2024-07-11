import path from "path";
import fs from "fs";
import Mustache from "mustache";
import { PromptType, DynamicType } from "../../types";
import { ask } from "../../adapters";
import { useStore } from "../../store";
import { interpolateIteration } from "../../utils";

const importPrompt = (filePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolutePath, "utf8");
};

const parsePromptsFromFile = (content: string): Record<string, string> => {
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

const run = async (prompt: PromptType, dynamic: DynamicType) => {
  const data = useStore.getState();

  // @ts-ignore
  const iterationValue = prompt.iteratable?.iterationValue || "";
  // @ts-ignore
  const iteration = prompt.iteratable?.iteration || -1;

  const promptWithIteration =
    (iteration &&
      interpolateIteration(prompt.content, {
        iteration,
        iterationValue,
      })) ||
    prompt.content;

  const interpolatedContent = Mustache.render(promptWithIteration as string, {
    ...{
      context: data.context,
      ...data.generations,
    },
    generationName: `${dynamic.name}.${prompt.name}`,
    iterationValue,
    iteration,
  });

  // console.log(`++++\n${interpolatedContent}++++`);

  console.log(`Invoking Prompt: ${prompt.name}`);
  const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;
  return aiResponse;
};

export default function Prompt() {
  return {
    create: function (content: string | Partial<PromptType>) {
      if (typeof content === "string") {
        return {
          ...this.prompt,
          content,
        };
      } else {
        return {
          ...this.prompt,
          ...content,
        };
      }
    },
    prompt: {
      name: "Prompt",
      content: "Default prompt content",
      model: "LLAMA3",
      run: function (dynamic: DynamicType) {
        return run(this as unknown as PromptType, dynamic);
      },
    },
  };
}
