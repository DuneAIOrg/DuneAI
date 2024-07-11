#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

// Function to install dependencies
const installDependencies = async (
  projectDir,
  adapters,
  providers,
  typescript,
) => {
  const ora = (await import("ora")).default;
  const dependencies = [];

  // dependencies.push("duneai/duneai");

  if (typescript) {
    dependencies.push("typescript");
    dependencies.push("ts-node");
  }
  if (adapters.includes("GPT4ALL")) {
    dependencies.push("gpt4all");
  }
  if (adapters.includes("Vercel AI")) {
    dependencies.push("ai");
  }
  if (adapters.includes("SD")) {
    // dependencies.push("@ai-sdk/standard-diffusion");
  }

  const providerDependencies = {
    OpenAI: "@ai-sdk/openai",
    AzureOpenAI: "@ai-sdk/azure",
    Anthropic: "@ai-sdk/anthropic",
    AmazonBedrock: "@ai-sdk/amazon-bedrock",
    GoogleGenerativeAI: "@ai-sdk/google",
    GoogleVertex: "@ai-sdk/google-vertex",
    Mistral: "@ai-sdk/mistral",
    Cohere: "@ai-sdk/cohere",
    Groq: "@ai-sdk/openai",
    Perplexity: "@ai-sdk/openai",
    Fireworks: "@ai-sdk/openai",
    LLamaCpp: "nnance/llamacpp-ai-provider",
    Ollama: "sgomez/ollama-ai-provider",
    ChromeAI: "jeasonstudio/chrome-ai",
  };

  providers !== "." &&
    providers.forEach((provider) => {
      if (providerDependencies[provider]) {
        dependencies.push(providerDependencies[provider]);
      }
    });

  if (dependencies.length > 0) {
    const spinner = ora("Installing dependencies...").start();
    try {
      execSync(`npm install ${dependencies.join(" ")}`, {
        cwd: projectDir,
        stdio: "inherit",
      });
      spinner.succeed("Dependencies installed successfully.");
    } catch (error) {
      spinner.fail("Error installing dependencies.");
      console.error(chalk.red(error));
    }
  }
};

// Function to convert string to camel case
const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase(),
    )
    .replace(/\s+/g, "");
};

// Function to capitalize the first letter of each word
const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Function to create package.json file
const createPackageJson = (projectDir, { typescript, projectName }) => {
  const packageJsonContent = {
    name: projectName,
    version: "0.1.0",
    main: typescript ? "src/index.ts" : "src/index.js",
    scripts: {
      start: typescript ? "ts-node src/index.ts" : "node src/index.js",
    },
    dependencies: {
      duneai: "github:KenanKStipek/duneai",
    },
  };

  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(packageJsonContent, null, 2),
  );
};

// Function to install selected factories
const installFactories = async (factories, projectDir) => {
  const chalk = (await import("chalk")).default;
  const tmpDir = path.join(projectDir, "tmpFactories");

  // Clone the entire repository
  const repoUrl = "https://github.com/DuneAIOrg/Factories.git";
  console.log(`Cloning repository from ${repoUrl} to ${tmpDir}`);

  try {
    execSync(`git clone ${repoUrl} ${tmpDir}`, { stdio: "inherit" });
  } catch (err) {
    console.error(chalk.red(`Failed to clone repository: ${err.message}`));
    return;
  }

  // Copy the selected factories to the project directory
  factories.forEach((factory) => {
    const srcFactoryDir = path.join(tmpDir, factory);
    const destFactoryDir = path.join(projectDir, "src", "factories", factory);

    if (fs.existsSync(srcFactoryDir)) {
      fs.ensureDirSync(destFactoryDir);
      fs.copySync(srcFactoryDir, destFactoryDir);
      console.log(`Successfully copied factory ${factory}`);
    } else {
      console.error(
        chalk.red(`Factory ${factory} does not exist in the repository`),
      );
    }
  });

  // Remove the temporary cloned repository
  fs.removeSync(tmpDir);
  console.log(`Removed temporary directory ${tmpDir}`);
};

// Dynamically import chalk, ora, inquirer, and chalk-animation
async function setup() {
  const chalk = (await import("chalk")).default;
  const ora = (await import("ora")).default;
  const inquirer = (await import("inquirer")).default;
  const inquirerSearchCheckbox = (await import("inquirer-search-checkbox"))
    .default;
  const chalkAnimation = (await import("chalk-animation")).default;

  // Register inquirer-search-checkbox prompt
  inquirer.registerPrompt("search-checkbox", inquirerSearchCheckbox);

  const program = new Command();

  program
    .name("setup")
    .description("Setup script for initializing DuneAI projects")
    .option("-n, --name <projectName>", "Project name")
    .option("-f, --factory true|false", "Creating a factory?", false)
    .option("-o, --output <outputDir>", "Output directory")
    .option("-w, --worm, --vvorm", "Include VVORM", false)
    .option("-a, --adapters <adapters>", "Include adapters", ".")
    .option("--factories <factories>", "Install Factories", ".")
    .option("-p, --providers <providers>", "Include providers", ".")
    .option(
      "-e, --example",
      "Include default example 'Hello World' skeleton",
      true,
    )
    .option("-h, --help", "Display help for command");

  program.on("--help", () => {
    console.log("");
    console.log("Detailed Help:");
    console.log("");
    console.log("Options:");
    console.log("  -n, --name <projectName>          Project name (required)");
    console.log(
      "                                    Example: --name myProject",
    );
    console.log("");
    console.log(
      "  -o, --output <outputDir>          Output directory for the project",
    );
    console.log(
      "                                    Default: Camel case version of the project name",
    );
    console.log(
      "                                    Example: --output ./myProjectDir",
    );
    console.log("");
    console.log("  -w, --worm                Include WORM in the project");
    console.log("                                    Default: false");
    console.log("                                    Example: --worm");
    console.log("");
    console.log(
      "  -a, --adapters <adapters>         Include specified adapters in the project",
    );
    console.log(
      "                                    Example: --adapters GPT4ALL,AI,SD",
    );
    console.log("");
    console.log(
      "  -f, --factories <factories>       Install specified factories in the project",
    );
    console.log(
      "                                    Example: --factories Factory1,Factory2",
    );
    console.log("");
    console.log(
      "  -p, --providers <providers>       Include specified providers in the project",
    );
    console.log(
      "                                    Example: --providers OpenAI,Anthropic",
    );
    console.log("");
    console.log(
      "  -e, --example                     Include default example 'Hello World' skeleton",
    );
    console.log("                                    Default: true");
    console.log("                                    Example: --example");
    console.log("");
    console.log("  -h, --help                        Display help for command");
    console.log("");
    console.log("Examples:");
    console.log("  $ setup --name myProject --output ./myProject --worm");
    console.log(
      "  $ setup --name myProject --adapters GPT4ALL,AI --factories Factory1,Factory2",
    );
    console.log("  $ setup --help");
    console.log("");
    console.log(
      "For more information, visit https://github.com/KenanKStipek/DuneAI",
    );
  });

  program.parse(process.argv);

  const options = program.opts();
  const https = require("https");
  const availableFactories = await new Promise((resolve, reject) => {
    https
      .get(
        "https://raw.githubusercontent.com/DuneAIOrg/Factories/main/index.json",
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(data).map((factory) => factory.name));
          });
        },
      )
      .on("error", (err) => {
        reject(err);
      });
  });

  const availableProviders = [
    "OpenAI",
    "AzureOpenAI",
    "Anthropic",
    "AmazonBedrock",
    "GoogleGenerativeAI",
    "GoogleVertex",
    "Mistral",
    "Cohere",
    "Groq",
    "Perplexity",
    "Fireworks",
    "LLamaCpp",
    "Ollama",
    "ChromeAI",
  ];

  const askQuestions = async () => {
    const questions = [];

    if (!options.name) {
      questions.push({
        type: "input",
        name: "projectName",
        message: "What is the name of your project?",
      });
    }

    if (!options.factory) {
      questions.push({
        type: "confirm",
        name: "factory",
        message: "Are you creating a Factory?",
        default: false,
      });
    }

    if (!options.output) {
      questions.push({
        type: "input",
        name: "output",
        message: "What is the output directory?",
        default: (answers) =>
          answers.factory
            ? capitalize(toCamelCase(answers.projectName || options.name))
            : toCamelCase(answers.projectName || options.name),
      });
    }

    questions.push({
      type: "confirm",
      name: "typescript",
      message: "Would you like to use TypeScript?",
      default: true,
    });

    questions.push({
      type: "confirm",
      name: "worm",
      message:
        "Would you like to include and use WORM (Workflow Orchestration and Regenerative Monitor)?",
      default: false,
      when: (answers) => !answers.factory,
    });

    questions.push({
      type: "confirm",
      name: "example",
      message:
        "Would you like to include the example 'Hello World' orchestration?",
      default: false,
      when: (answers) => !answers.factory,
    });

    questions.push({
      type: "checkbox",
      name: "adapters",
      message: "Select adapters to include:",
      choices: [
        { name: "GPT4ALL", checked: true, value: "GPT4ALL" },
        { name: "Vercel AI", checked: true, value: "Vercel AI" },
        { name: "Standard Diffusion", value: "Standard Diffusion" },
      ],
      when: (answers) => !answers.factory && options.adapters === ".",
    });

    questions.push({
      type: "checkbox",
      name: "providers",
      message: "Select providers to include:",
      choices: availableProviders.map((provider) => ({
        name: provider,
        value: provider,
        checked: provider === "OpenAI" || provider === "Anthropic",
      })),
      pageSize: 5,
      when: (answers) => {
        const selectedAdapters =
          options.adapters === "."
            ? answers.adapters
            : options.adapters.split(",");
        return !answers.factory && selectedAdapters.includes("Vercel AI");
      },
    });

    questions.push({
      type: "search-checkbox",
      name: "factories",
      message: "Select factories to install:",
      choices: availableFactories,
      pageSize: 5,
      when: (answers) => !answers.factory && options.factories === ".",
    });

    const answers = await inquirer.prompt(questions);

    return {
      ...options,
      ...answers,
    };
  };

  const createProjectStructure = async (
    projectName,
    outputDir,
    adapters,
    factories,
    providers,
    typescript,
    worm,
    example,
    factory,
  ) => {
    try {
      const spinner = ora("Creating project structure...").start();

      try {
        const projectDir = path.resolve(outputDir);
        fs.ensureDirSync(projectDir);

        if (!factory && factories && factories.length > 0) {
          installFactories(factories, projectDir);
        }

        if (!factory) {
          createPackageJson(projectDir, {
            projectName,
            providers,
            typescript,
            worm,
          });

          const configContent = `Project Name: ${projectName}\nAdapters: ${adapters}\nFactories: ${factories}\nProviders: ${providers}\nInclude WORM: ${worm}\nInclude Example: ${example}`;
          fs.writeFileSync(path.join(projectDir, "README.md"), configContent);

          // Create .env file with API key placeholders
          let envContent = ``;
          providers !== "." &&
            providers?.forEach((provider) => {
              envContent += `${provider.toUpperCase().replace(/\s+/g, "_")}_API_KEY=###\n`;
            });
          fs.writeFileSync(path.join(projectDir, ".env"), envContent);
        }

        if (!example) {
          fs.ensureDirSync(path.resolve(outputDir, "src"));

          const promptsContent = `# Test
This is a test, please respond.
      `;
          fs.writeFileSync(
            path.join(projectDir, "src", "Prompts.prompt"),
            promptsContent,
          );

          const indexContent = typescript
            ? `// @ts-ignore
import DuneAI from "duneai";
const { Test } = DuneAI.importPrompts("src/Prompts.prompt");

// Define a dynamic
const dynamic = DuneAI.createDynamic({
  name: "TestDynamic",
  prompts: [{ Test }],
});

(async () => {
  const result = await dynamic.run();
  console.log({ result });
})();
            `
            : `
const DuneAI = require("duneai");
const { Test } = DuneAI.importPrompts("src/Prompts.prompt");

// Define a dynamic
const dynamic = DuneAI.createDynamic({
  name: "TestDynamic",
  prompts: [{ Test }],
});

(async () => {
  const result = await dynamic.run();
  console.log({ result });
})();
            `;

          fs.writeFileSync(
            path.join(projectDir, "src", typescript ? "index.ts" : "index.js"),
            indexContent,
          );
        } else {
          const exampleDir = path.join(__dirname, "..", "src", "skeleton");
          fs.copySync(exampleDir, projectDir);
        }

        // Install dependencies based on selections
        console.log(chalk.bgGrey(chalk.yellow("\nInstalling Dependencies")));
        await installDependencies(projectDir, adapters, providers, typescript);

        const adapterRequirements =
          adapters.includes("GPT4ALL") &&
          `If you haven't already, install and configure GPT4ALL. More information here: https://github.com/nomic-ai/gpt4all `;

        const envRequirements =
          providers !== "." &&
          `Add your API key(s) to the .env file for these providers: ${providers.join(", ")}`;

        const instructions = `${adapterRequirements}\n${envRequirements}\n\nUse \`cd ${projectDir} && npm run start\` to run project`;

        const onlyMessage = `${projectName} has been created successfully.`;

        spinner.succeed(onlyMessage);
        console.log(chalk.bgGrey(chalk.yellow(instructions)));
      } catch (error) {
        spinner.fail("Error creating project structure.");
        console.error(chalk.red(error));
      }
    } catch (error) {
      spinner.fail("Error creating project structure.");
      console.error(chalk.red(error));
    }
  };

  const runSetup = async () => {
    const bannerText = `
      ............................................................
      ░.......░░░..░░░░..░░...░░░..░░........░░░......░░░........░
      ▒..▒▒▒▒..▒▒..▒▒▒▒..▒▒....▒▒..▒▒..▒▒▒▒▒▒▒▒..▒▒▒▒..▒▒▒▒▒..▒▒▒▒
      ▓..▓▓▓▓..▓▓..▓▓▓▓..▓▓..▓..▓..▓▓......▓▓▓▓..▓▓▓▓..▓▓▓▓▓..▓▓▓▓
      █..████..██..████..██..██....██..████████........█████..████
      █.......████......███..███...██........██..████..██........█
      ............................................................
      `;

    const animation = chalkAnimation.karaoke(bannerText, 9);
    setTimeout(async () => {
      animation.stop();
      console.log(chalk.bgYellow(chalk.black("Starting setup...")));
      const answers = await askQuestions();
      createProjectStructure(
        answers.projectName,
        answers.output,
        answers.adapters,
        answers.factories,
        answers.providers,
        answers.typescript,
        answers.worm,
        answers.example,
        answers.factory,
      );
    }, 450);
  };

  runSetup();
}

setup();
