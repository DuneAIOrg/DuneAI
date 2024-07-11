# DuneAI

DuneAI offers a powerful framework for generating dynamic stories using various AI models. This README provides a comprehensive overview of how to use and extend the DuneAI project.

## Table of Contents

- [Usage](#usage)
- [Middleware](#middleware)
- [Adapters](#adapters)
- [Types](#types)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Usage

To get started with generating a story:

1. **Configure Environment Variables**

   Ensure you have your OpenAI API Key set up as an environment variable.

   ```sh
   export OPENAI_API_KEY='YOUR_API_KEY'
   ```

2. **Running the Script**

   ```sh
   npm run dev
   ```

3. **Example: Customizing Your Story**

   Modify parameters in `runPrimeDynamic` in `.skeleton/src/index.ts` to customize the genre, character count, paragraph count, and author.

   ```typescript
   import { runPrimeDynamic } from "./skeleton/src/dynamics";

   (async () => {
     const result = await runPrimeDynamic({
       genre: "science fiction",
       characterCount: 4,
       paragraphCount: 5,
       author: "Isaac Asimov",
     });
     console.log("Generated Story:", result);
   })();
   ```

### Adding Custom Prompts

Add your prompts as Mustache files in the `prompts` directory and use them in your dynamic structures. Here’s an example of how to create and use these prompts:

1. **Create Prompt Files**

   Create a file named `Introduction.prompt` in the `prompts` directory with the following content:

   ```mustache
   Write an introduction for a story set in a {{ genre }} world with {{ characterCount }} characters.
   ```

   Create another file named `Paragraph.prompt` in the `prompts` directory with the following content:

   ```mustache
   Continue the story with a paragraph that includes interactions between the characters.
   ```

2. **Import and Use Prompts**

   Modify the dynamic structure to use these prompts:

   ```typescript
   import { runPrimeDynamic } from "./skeleton/src/dynamics";
   import { importPrompts } from "./skeleton/src/utils";

   // Import prompts from files
   const { Introduction, Paragraph } = importPrompts([
     "prompts/Introduction.prompt",
     "prompts/Paragraph.prompt",
   ]);

   const storyDynamic = {
     name: "SciFiStory",
     kind: "chainOfThought",
     prompts: [
       { name: "Introduction", content: Introduction },
       { name: "Paragraph", content: Paragraph },
     ],
   };

   (async () => {
     const result = await runPrimeDynamic({
       genre: "science fiction",
       characterCount: 4,
       paragraphCount: 5,
       author: "Isaac Asimov",
     }, storyDynamic);
     console.log("Generated Story:", result);
   })();
   ```

### Logging and Debugging

Customize logging by defining your `Logger` interface in `./middleware/logger.ts`.

### Known Issues and Troubleshooting

- **Loading models or obtaining AI responses:** Ensure API keys are configured correctly.
- **Script execution errors:** Check logs for error messages and ensure all dependencies are installed.

## Middleware

Middleware in DuneAI provides modular enhancements to the data flow and processing interactions.

### Logger Middleware

The Logger middleware offers a standardized approach to logging throughout the application. By default, it uses the console but can be customized to use any logging framework.

### Custom Middleware

Create additional middleware to handle concerns like authentication, request/response transformation, rate limiting, and more.

## Adapters

Adapters facilitate communication with various AI services and platforms, enabling dynamic content generation.

### Available Adapters

- **OpenAI**: Connects to the OpenAI API for text generation.
- **GPT4All**: Interfaces with the GPT-4-All models for local or custom text generation.
- **SDWebUI**: Integrates with Stable Diffusion Web UI for image generation.

### Unified `ask` Method

The unified `ask` method routes requests to the appropriate adapter based on the model key, providing a consistent interface for generating content.

```typescript
import * as gpt4all from "./gpt4all";
import * as openai from "./openai";
import * as sdwebui from "./sdwebui";

export const ADAPTERS = {
  GPT4ALL: gpt4all,
  OPENAI: openai,
  SDWEBUI: sdwebui,
};

export const MODELS = {
  GPT_FOUR: { model: "gpt-4", adapter: "OPENAI" },
  GPT_THREE: { model: "gpt-3.5-turbo", adapter: "OPENAI" },
  MISTRAL_7B: { model: "mistral-7b-openorca.gguf.q4_0", adapter: "GPT4ALL" },
  ORCA_MINI_3B: { model: "orca-mini-3b-gguf.q4_0", adapter: "GPT4ALL" },
  LLAMA3: { model: "Meta-Llama-3-8B-Instruct.Q4_0.gguf", adapter: "GPT4ALL" },
  SD: { model: "sd", adapter: "SDWEBUI" },
} as const;

export async function ask(
  prompt: string | Record<string, any>,
  modelKey: keyof typeof MODELS,
  options?: any,
) {
  const adapterKey = MODELS[modelKey].adapter;
  const model = MODELS[modelKey].model;
  const adapter = ADAPTERS[adapterKey];
  return adapter.ask(prompt, { model, ...options });
}
```

## Types

Defines the various types and interfaces used throughout the project to ensure type safety and consistency.

### AIModel

```typescript
export type AIModel = (typeof MODELS)[keyof typeof MODELS];
```

### DynamicTypeKind

```typescript
export type DynamicTypeKind = "chainOfThought" | "treeOfThought";
```

### PromptType

```typescript
export type PromptType = {
  name: string;
  content: string | PromptType;
  model: AIModel;
  run: (dynamic: DynamicType, context: any) => Promise<string>;
};
```

### DynamicType

```typescript
export type DynamicType = {
  name: string;
  kind: DynamicTypeKind;
  context: Record<string, any>;
  prompts: PromptType[];
  run: (dynamic: DynamicType) => Promise<string>;
};
```

## Contribution Guidelines

We welcome contributions to the DuneAI project! Follow these steps to contribute:

1. **Fork the Repository**
2. **Clone the Fork**
3. **Create a Branch**
4. **Make Changes**
5. **Commit and Push**
6. **Create a Pull Request**

### Coding Standards

- Ensure consistency with existing code style.
- Update or add documentation for new features.
- Write tests for new features and ensure existing tests pass.

### Reporting Issues

Report bugs or feature requests in the [Issues](https://github.com/github_username/repo_name/issues) section.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

This Readme was written using DuneAI, and GPT4o. It was edited with ChatGPT by GPT4o and Kenan Stipek.
