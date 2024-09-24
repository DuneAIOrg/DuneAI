# DuneAI: The World's First Open Source Cybernetic Orchestration Framework

DuneAI is a groundbreaking artificial intelligence orchestration framework, built on the principles of cybernetics. As the world's first open-source Cybernetic Orchestration Framework, DuneAI brings a new level of intelligence, flexibility, and adaptability to AI workflows. Unlike conventional systems, DuneAI enables AI to analyze its own outputs and adjust future actions, resulting in self-evolving, adaptive systems.

## Core Concepts

What sets DuneAI apart is its ability to form cybernetic feedback loops, allowing AI to continuously refine its behavior based on its outputs. While traditional frameworks focus on chaining operations or data retrieval, DuneAI empowers AI to learn from its results and autonomously modify its decision-making processes. This capacity makes DuneAI particularly effective for complex workflows that require ongoing adaptation.

### Components of DuneAI

DuneAI's functionality revolves around two core constructs: **Dynamics** and **Prompts**.

- **Dynamics** are state-aware, reusable components that manage how workflows are executed, adapting based on the AI's evolving state to allow for flexible orchestration.

- **Prompts** are modular commands that interface with AI models. Enhanced with Mustache syntax, Prompts allow dynamic state injection at runtime, ensuring interactions evolve alongside workflow progress. Prompts retrieve outputs and shape workflows across real-time state changes.

These constructs work together to enable adaptive orchestration, where workflows adjust and refine themselves through feedback mechanisms.

## Installation

To install DuneAI, follow these steps to set up a basic Node.js environment:

### Prerequisites

1. **Node.js**: Install Node.js (version 14.x or later) from [nodejs.org](https://nodejs.org/).
2. **npm (Node Package Manager)**: Included with Node.js. Verify its installation using:
   ```bash
   npm -v
   ```
3. **Git**: Ensure Git is installed for version control. Download it from [git-scm.com](https://git-scm.com/).

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KenanKStipek/DuneAI.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd DuneAI
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Setup Environment Variables**: Create a `.env` file in the root directory with your configuration options:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key_here
   DEFAULT_MODEL=gpt-4o-mini
   DEFAULT_ADAPTER=openai
   ```

5. **Run the Application**:
   ```bash
   npm start
   ```

### Additional Notes

- For TypeScript users: install it globally by running:
  ```bash
  npm install -g typescript
  ```

- Check the [Documentation](https://github.com/KenanKStipek/DuneAI/wiki) for detailed instructions on configuring additional features and settings.

## Usage

DuneAI provides a flexible framework for orchestrating AI workflows, facilitating modularity and adaptability through Dynamics and Prompts.

### Basic Workflow

1. **Import DuneAI**:
   ```typescript
   import DuneAI from "duneai";
   ```

2. **Create a Prompt**:
   ```typescript
   const prompt = {
       name: "GreetingPrompt",
       content: "What would you like to say?",
       model: "gpt-4o-mini",
   };
   ```

3. **Create a Dynamic**:
   ```typescript
   const greetingDynamic = DuneAI.createDynamic("GreetingDynamic", {}, [prompt]);
   ```

4. **Run the Dynamic**:
   ```typescript
   (async () => {
       const result = await greetingDynamic.run({});
       console.log(result);
   })();
   ```

### Advanced Configuration

DuneAI allows for advanced configurations, integrating multiple prompts and decision-making logic based on previous results, facilitating more complex workflows.

## Features

DuneAI enhances AI orchestration through various powerful features:

1. **Cybernetic Feedback Loops**: Enabling continuous adaptation based on outputs.
2. **Dynamic Workflow Management**: State-aware components that adjust workflows flexibly.
3. **Modular Prompts**: Commands that dynamically adapt based on runtime states.
4. **Error Handling and Logging**: Built-in mechanisms for graceful error management.
5. **Flexible Configuration**: Easily configure through environment variables.
6. **Throttling Mechanism**: Manages API call rates efficiently using Bottleneck.
7. **Support for Multiple AI Models and Adapters**: Easily switch between AI models.
8. **Integration with External Services**: Works well with various AI platforms.
9. **User-friendly API**: Intuitive methods for managing Dynamics and Prompts.
10. **Comprehensive Documentation**: Detailed resources for quick onboarding.

## Roadmap

The DuneAI project is continuously evolving. Here’s a glimpse into our planned features and improvements:

- **Version 1.0**: Initial release with core features and adapter integration.
- **Version 1.1**: Enhanced user experience with UI improvements and performance optimizations.
- **Version 1.2**: Support for multi-language prompts and increased adapter availability.
- **Future Directions**: Focus on AI personalization, IoT integration, and security enhancements.

## FAQ

1. **What is DuneAI?**  
   DuneAI is an open-source Cybernetic Orchestration Framework for creating adaptive AI workflows.

2. **How do I install DuneAI?**  
   Follow the instructions in the [Installation](#installation) section.

3. **What are Dynamics and Prompts?**  
   Dynamics manage workflow execution, while Prompts are modular commands that interface with AI models.

4. **Can I use multiple AI models?**  
   Yes, DuneAI supports various AI models via its adapter system.

5. **How do I manage environment variables?**  
   Use a `.env` file in the root directory to define your variables.

## Contributing

Contributions to DuneAI are welcome. To contribute:

1. Fork the repository.
2. Clone your fork.
3. Create a branch.
4. Make changes and test them.
5. Commit your changes.
6. Push to your fork.
7. Submit a pull request.

Your feedback and contributions enhance DuneAI’s capabilities and foster a collaborative community. Thank you for your interest in DuneAI! 

## License

DuneAI is licensed under the MIT License, allowing free use, modification, and distribution of the software. Please refer to the full license text in the repository.

## Community and Support

Connect with other users and developers through our GitHub Discussions, community forums, or social media channels for announcements and updates. Your engagement helps create a vibrant DuneAI ecosystem.