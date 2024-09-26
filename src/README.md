# README.md

## DuneAI: The World's First Open Source Cybernetic Orchestration Framework

DuneAI is a breakthrough in artificial intelligence orchestration, built on the principles of cybernetics. As the world’s first open-source Cybernetic Orchestration Framework, DuneAI offers a new level of intelligence, flexibility, and adaptability to AI workflows. Unlike conventional systems, DuneAI enables AI to analyze its own outputs and adjust future actions, resulting in self-evolving, adaptive systems.

## Features

### Cybernetic Feedback Loops

What makes DuneAI unique is its ability to form cybernetic feedback loops—allowing AI to continuously refine its behavior based on its outputs. While traditional frameworks focus on chaining operations or retrieving data, DuneAI empowers AI to learn from its results and modify its decision-making process autonomously. This makes DuneAI particularly effective for complex workflows that require ongoing adaptation.

## Core Constructs of DuneAI

DuneAI’s functionality is built around two core constructs: **Dynamics** and **Prompts**.

### Dynamics

Dynamics are reusable, state-aware components that manage how workflows are executed. They adapt based on the AI's evolving state, enabling flexible orchestration.

**Key Features of Dynamics:**
1. **State Awareness**: Each Dynamic stores and manages its state, crucial for workflows that need to remember past interactions.
2. **Modularity**: Dynamics can be reused across projects, enhancing code maintainability and reusability.
3. **Adaptability**: Dynamic behavior adjusts based on current state through feedback loops, influencing future operations.
4. **Integration with Prompts**: Dynamics work seamlessly with Prompts for advanced real-time interactions.
5. **Feedback Loop Mechanism**: Allows Dynamics to refine their behavior over time, making DuneAI effective for complex workflows.

### Prompts

Prompts are modular commands that interface with AI models, enhancing the adaptability of AI workflows. They enable developers to define how AI responds to specific inputs and facilitate dynamic state injections.

**Key Features of Prompts:**
1. **Modularity**: Prompts are reusable across multiple projects, simplifying development.
2. **Dynamic State Injection**: Enhanced with Mustache syntax, allowing real-time context-aware adjustments.
3. **Versatile Interfacing**: Prompts can interact with AI models and external systems, shaping workflows based on real-time inputs.
4. **Integration with Dynamics**: Ensures that AI model outputs can influence subsequent actions, creating adaptive systems.
5. **Enhanced Prompt Management**: Provides capabilities for managing and importing Prompts efficiently.

## Cybernetic Principles

Cybernetics in DuneAI underpins its design, enabling intelligent feedback and adaptive behaviors. 

**Key Features:**
1. **Feedback Loops**: Essential for learning from actions, allowing components to adjust based on results.
2. **State Management**: Components maintain awareness of their states, informing decisions and adjustments.
3. **Adaptive Learning**: Algorithms refine processes and outputs based on new data and user interactions.
4. **Modular Cybernetics**: Promotes modular design allowing complex interactions from simpler components.
5. **Dynamic Interaction**: Facilitates responsive interactions between Dynamics and Prompts.

## Middleware

Middleware in DuneAI provides a communication layer that simplifies data exchange between system components.

**Key Features:**
1. **Data Persistence**: Persist state data ensuring continuity across different sessions.
2. **Logging and Monitoring**: Trace interactions for debugging and performance insights.
3. **Throttling Operations**: Manage request rates, preventing overload on external APIs.
4. **Customizable Logger Interface**: Tailor logging behaviors to meet specific needs.
5. **Modular Middleware Components**: Easily add or modify middleware to fit project requirements.

## Utils

The Utils module includes various helpful functions and utilities to enhance development.

**Key Features:**
1. **Asynchronous Operations**: Functions for managing timing and execution flow.
2. **Retry Mechanism**: Robust error handling for transient issues.
3. **Data Manipulation Functions**: Randomizes data order and prepares data for processing.
4. **Token Counting**: Calculates token usage for AI model inputs.
5. **Object Management**: Converts JSON data into usable JavaScript objects safely.

## Types

The Types module defines essential type interfaces to maintain safety and clarity within the framework.

**Key Features:**
1. **Type Definitions for Core Components**: Ensures implementations are consistent.
2. **Nested Object Types**: Manage complex data structures effectively.
3. **Dynamic Options and State Management**: Define parameters relevant to Dynamics.
4. **Selector Options**: Types for managing selections in workflows.
5. **Utility Types**: Simplify the creation and management of complex data structures.

## Installation

To get started with DuneAI, set up your development environment by following these steps:

### Prerequisites

Ensure you have the following installed:
- **Node.js (14.x or above)**: Download from [nodejs.org](https://nodejs.org/).
- **npm**: Included with Node.js installations for managing dependencies.

### Step-by-Step Installation

1. **Create a New Project Directory**:
   ```bash
   mkdir my-duneai-project
   cd my-duneai-project
   ```

2. **Initialize a New Node.js Project**:
   ```bash
   npm init -y
   ```

3. **Install DuneAI**:
   ```bash
   npm install DuneAIOrg/duneai
   ```

4. **Install Additional Dependencies**:
   Example for the GPT4ALL adapter:
   ```bash
   npm install gpt4all
   ```

5. **Set Up TypeScript (Optional)**:
   ```bash
   npm install typescript ts-node --save-dev
   ```

6. **Create a .env file**:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ```

7. **Project Structure**:
   Organize your project as follows:
   ```plaintext
   my-duneai-project/
   ├── src/
   │   ├── index.ts
   │   └── Prompts.prompt
   └── .env
   ```

8. **Run Your Project**:
   For TypeScript:
   ```bash
   npx ts-node src/index.ts
   ```
   For JavaScript:
   ```bash
   node src/index.js
   ```

### Verify the Installation

Run a simple script to check for errors. If there are none, you have successfully installed DuneAI.

### Troubleshooting

If you encounter issues:
- Check your Node.js and npm versions.
- Refer to DuneAI's documentation for updates or known issues.
- Ensure a stable internet connection.

## Project Structure

The DuneAI project structure is designed for modularity and maintainability. Below is a typical structure:

```plaintext
my-duneai-project/
├── src/
│   ├── adapters/
│   │   ├── gpt4all.ts
│   │   ├── openai.ts
│   │   └── sdwebui.ts
│   ├── dynamics/
│   │   └── index.ts
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   └── persist.ts
│   ├── modules/
│   │   ├── Cybernetics/
│   │   ├── Dynamic/
│   │   ├── Prompt/
│   │   └── constants.ts
│   ├── scripts/
│   │   ├── GenerateReadme/
│   │   └── setup.js
│   ├── store/
│   │   └── index.ts
│   ├── utils/
│   │   ├── index.ts
│   │   └── throttling.ts
│   ├── index.ts
│   └── Prompts.prompt
├── .env
└── package.json
```

### Directory Breakdown

- **src/**: Main directory for application code.
  
- **adapters/**: Contains different adapters for AI models and services.

- **dynamics/**: Core components for orchestrating workflows.

- **middleware/**: Middleware functions for interaction among components.

- **modules/**: Functional components related to DuneAI.

- **scripts/**: Utility scripts for various tasks.

- **store/**: Logic for managing application state.

- **utils/**: Helpers for data manipulation and common operations.

- **index.ts**: Entry point for the application.

- **Prompts.prompt**: File for defining reusable AI prompts.

- **.env**: Environmental variables file.

- **package.json**: Project metadata and dependencies.

### Guidelines for Structuring Your Code

- **Modularity**: Keep related functionalities organized.
  
- **Naming Conventions**: Use clear, descriptive names for files.

- **Configuration Management**: Use the .env file for sensitive content.

- **Separation of Concerns**: Each component should address a distinct functionality.

By following this comprehensive structure and guidelines, developers can efficiently utilize DuneAI for advanced AI orchestration, building adaptable and intelligent systems.