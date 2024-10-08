# DuneAI: AI Orchestration Framework

DuneAI is a highly opinionated AI framework designed for TypeScript, focusing on ease of use and advanced AI orchestration. It leverages runtime interpolation, multi-model support, and lifecycle hooks to make complex AI interactions simple and efficient.

## Table of Contents

- [Usage](#usage)
- [Core Components](#core-components)
  - [Prompts](#prompts)
  - [Dynamics](#dynamics)
  - [ImportPrompts and CreateDynamic](#importprompts-and-createdynamic)
- [Advanced Features](#advanced-features)
  - [Context and Generations stored in State](#context-and-generations-stored-in-state)
  - [Chain of Thought (COT) and Tree of Thought (TOT)](#chain-of-thought-cot-and-tree-of-thought-tot)
  - [Iteration](#iteration)
  - [Spice (Runtime Prompt Pre-processing Snippets)](#spice-runtime-prompt-pre-processing-snippets)
- [Utilities](#utilities)
  - [Adapters](#adapters)
  - [Factories](#factories)
  - [Observability with WORM](#observability-with-worm)
- [Upcoming Features](#upcoming-features)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Usage

To get started with generating a story:

1. **Install GPT4ALL**

   Ensure you have GPT4ALL installed. You can find the installation instructions [here](https://gpt4all.io/index.html).

2. **Running the Script**

   ```sh
   # Clone this repository and then...
   npm run setup
   cd projectDirectory
   npm run start
   ```

3. **Example: Customizing Your Orchistration**

   Modify parameters in `runPrimeDynamic` in `.skeleton/src/index.ts` to customize the genre, character count, paragraph count, and author.

   ```typescript
   // @ts-ignore
   import DuneAI from "duneai";

   const { Countries } = DuneAI.importPrompts("src/Countries.prompt");
   const { Capitals, Info } = DuneAI.importPrompts("src/Prompts.prompt");

   const COUNTRY_COUNT = 3;
   const iterations = COUNTRY_COUNT;

   const primeDynamic = DuneAI.createDynamic({
     context: { Count: COUNTRY_COUNT },
     name: "Geography",
     prompts:
     [{ Countries }
       ...DuneAI.Iterator([{ Capitals }], { iterations }),
       ...DuneAI.Iterator([{ Info }], { iterations }),
     ],
   });

   (async () => {
     const result = await info.run();
     console.log({ result });
   })();
   ```

### Adding Custom Prompts

Add your prompts as Mustache files in the `prompts` directory and use them in your dynamic structures. Here’s an example of how to create and use these prompts:

1. **Create Prompt Files**

   Create a file named `Countries.prompt` in the `prompts` directory with the following content:

   ```mustache
   Pick and list {{ context.Count }} random countries.
   ```

   Create another file named `Prompts.prompt` in the `prompts` directory with the following content:

   ```mustache
   # Capitals
   Pick the listed number {{ iteration }} country in this list, return its capital city:
   {{ Geography.Countries }}

   # Info
   Provide an interesting fact about this capital city:
   {{ Geography.Capitals_iteration_${iteration} }}
   ```

2. **Import and Use Prompts**

   Modify the dynamic structure to use these prompts:

   ```typescript
   // @ts-ignore
   import DuneAI from "duneai";

   const { Countries } = DuneAI.importPrompts("src/Countries.prompt");
   const { Capitals, Info } = DuneAI.importPrompts("src/Prompts.prompt");

   const COUNTRY_COUNT = 3;
   const iterations = COUNTRY_COUNT;

   const primeDynamic = DuneAI.createDynamic({
     context: { Count: COUNTRY_COUNT },
     name: "Geography",
     prompts: [
       { Countries }
       ...DuneAI.Iterator([{ Capitals }], { iterations }),
       ...DuneAI.Iterator([{ Info }], { iterations }),
     ],
   });

   (async () => {
     const result = await info.run();
     console.log({ result });
   })();
   ```

## Core Components

### Prompts

Prompts are templates used to generate content. They can be created using Mustache files and imported using the `importPrompts` utility.

### Dynamics

Dynamics orchestrate the flow of prompts and manage the context and state. They can be of type "chainOfThought" or "treeOfThought".

### ImportPrompts and CreateDynamic

These utilities are used to import prompts and create dynamic structures.

```typescript
import { importPrompts, createDynamic } from 'duneai';

const { Countries } = importPrompts("src/Countries.prompt");
const { Capitals, Info } = importPrompts("src/Prompts.prompt");

const dynamic = createDynamic({
  name: 'Geography',
  kind: 'chainOfThought',
  prompts: [{ Countries }, { Capitals }, { Info }]
});
```

## Advanced Features

### Context and Generations stored in State

DuneAI stores both user-provided context and AI-generated responses, facilitating complex interactions and state management.

### Chain of Thought (COT) and Tree of Thought (TOT)

COT and TOT are techniques to manage and generate content in a sequential or branching manner.

### Iteration

DuneAI supports iterating over prompts and dynamics, allowing for repeated interactions and complex content generation.

### Spice (Runtime Prompt Pre-processing Snippets)

Spice allows for pre-processing of prompts at runtime, enabling dynamic content generation.

## Utilities

### Adapters

Adapters facilitate communication with various AI services and platforms.

- **GPT4ALL**: Local or custom text generation.
- **Vercel AI**: Seamless integration with Vercel AI services.
- **Standard Diffusion**: Image generation with Stable Diffusion.

### Factories

Factories allow for the composition and reuse of DuneAI instances.

### Observability with WORM

WORM (Workflow Orchestration and Regenerative Monitor) provides an observability dashboard for interstitial data processing within DuneAI instances.

## Upcoming Features

- Testing
- Data Regression Testing
- Fine Tuning
- Embeddings and vector search
- More entry points (REST API, Queue, etc.)
- ThinkingMachine: Auto-generated dynamic factories
- More Spice
- Additional adapters (e.g., HuggingFace)

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
