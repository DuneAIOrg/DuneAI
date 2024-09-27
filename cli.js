#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Function to install dependencies
const installDependencies = async (projectDir, typescript) => {
  const ora = (await import('ora')).default;
  const dependencies = [];
  const devDependencies = [];

  // Install duneai from GitHub repository
  dependencies.push('github:DuneAIOrg/duneai');

  if (typescript) {
    devDependencies.push('typescript', 'ts-node');
  }

  const spinner = ora('Installing dependencies...').start();
  try {
    if (dependencies.length > 0) {
      execSync(`npm install ${dependencies.join(' ')}`, {
        cwd: projectDir,
        stdio: 'inherit',
      });
    }
    if (devDependencies.length > 0) {
      execSync(`npm install -D ${devDependencies.join(' ')}`, {
        cwd: projectDir,
        stdio: 'inherit',
      });
    }
    spinner.succeed('Dependencies installed successfully.');
  } catch (error) {
    spinner.fail('Error installing dependencies.');
    console.error(error);
  }
};

// Function to convert string to camel case
const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase(),
    )
    .replace(/\s+/g, '');
};

// Function to create package.json file
const createPackageJson = (projectDir, { typescript, projectName }) => {
  const packageJsonContent = {
    name: projectName,
    version: '0.1.0',
    main: typescript ? 'src/index.ts' : 'src/index.js',
    scripts: {
      start: typescript
        ? 'ts-node src/index.ts'
        : 'node src/index.js',
    },
    dependencies: {
      duneai: 'github:DuneAIOrg/duneai',
    },
    devDependencies: {},
  };

  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2),
  );
};

// Main execution function
(async () => {
  // Dynamically import chalk, ora, inquirer, and chalk-animation
  const chalk = (await import('chalk')).default;
  const ora = (await import('ora')).default;
  const inquirer = (await import('inquirer')).default;
  const chalkAnimation = (await import('chalk-animation')).default;

  // Use yargs to parse command-line arguments
  const argv = yargs
    .usage('Usage: $0 [options]')
    .option('n', {
      alias: 'name',
      type: 'string',
      description: 'Project name',
    })
    .option('o', {
      alias: 'output',
      type: 'string',
      description: 'Output directory',
    })
    .option('t', {
      alias: 'typescript',
      type: 'boolean',
      description: 'Use TypeScript',
      default: true,
    })
    .option('e', {
      alias: 'example',
      type: 'boolean',
      description: "Include example from 'skeleton' folder",
      default: true,
    })
    .help('h')
    .alias('h', 'help')
    .epilog(
      'For more information, visit https://github.com/DuneAIOrg/DuneAI',
    ).argv;

  // Function to prompt for missing options
  const askQuestions = async () => {
    const questions = [];

    if (!argv.name) {
      questions.push({
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
      });
    } else {
      argv.projectName = argv.name;
    }

    if (!argv.output) {
      questions.push({
        type: 'input',
        name: 'output',
        message: 'What is the output directory?',
        default: (answers) =>
          toCamelCase(answers.projectName || argv.projectName),
      });
    } else {
      argv.output = argv.output;
    }

    if (argv.typescript === undefined) {
      questions.push({
        type: 'confirm',
        name: 'typescript',
        message: 'Would you like to use TypeScript?',
        default: true,
      });
    } else {
      argv.typescript = argv.typescript;
    }

    if (argv.example === undefined) {
      questions.push({
        type: 'confirm',
        name: 'example',
        message:
          "Would you like to include the example from the 'skeleton' folder?",
        default: true,
      });
    } else {
      argv.example = argv.example;
    }

    const answers = await inquirer.prompt(questions);

    return {
      ...argv,
      ...answers,
    };
  };

  // Function to create project structure
  const createProjectStructure = async (
    projectName,
    outputDir,
    typescript,
    example,
  ) => {
    try {
      const spinner = ora('Creating project structure...').start();

      const projectDir = path.resolve(outputDir);
      fs.ensureDirSync(projectDir);

      createPackageJson(projectDir, {
        projectName,
        typescript,
      });

      const configContent = `Project Name: ${projectName}\nInclude Example: ${example}`;
      fs.writeFileSync(path.join(projectDir, 'README.md'), configContent);

      // Create tsconfig.json if TypeScript is used
      if (typescript) {
        const tsconfigContent = {
          compilerOptions: {
            target: 'ES6',
            module: 'commonjs',
            outDir: 'dist',
            rootDir: 'src',
            esModuleInterop: true,
          },
          include: ['src/**/*'],
        };
        fs.writeFileSync(
          path.join(projectDir, 'tsconfig.json'),
          JSON.stringify(tsconfigContent, null, 2),
        );
      }

      // Use the example in 'skeleton' folder
      if (example) {
        const exampleDir = path.join(__dirname, 'src', 'skeleton');
        fs.copySync(exampleDir, projectDir);

        // Update the example code to use correct paths and import statements
        const indexFile = path.join(
          projectDir,
          'src',
          typescript ? 'index.ts' : 'index.js',
        );
        let indexContent = fs.readFileSync(indexFile, 'utf8');

        // Replace local path with correct import
        indexContent = indexContent.replace(
          /from\s+['"].*['"]/,
          `from "duneai"`,
        );

        // Update the path to the prompts file
        indexContent = indexContent.replace(
          /importPrompts\(['"].*['"]\)/,
          `importPrompts("./prompts.prompt")`,
        );

        fs.writeFileSync(indexFile, indexContent);
      } else {
        // Create basic project structure
        fs.ensureDirSync(path.resolve(projectDir, 'src'));

        // Optionally write some basic code
        const indexContent = typescript
          ? `// Basic TypeScript setup`
          : `// Basic JavaScript setup`;

        fs.writeFileSync(
          path.join(
            projectDir,
            'src',
            typescript ? 'index.ts' : 'index.js',
          ),
          indexContent,
        );
      }

      // Install dependencies
      console.log(chalk.bgGrey(chalk.yellow('\nInstalling Dependencies')));
      await installDependencies(projectDir, typescript);

      const instructions = `Use \`cd ${projectDir} && npm run start\` to run the project`;

      const onlyMessage = `${projectName} has been created successfully.`;

      spinner.succeed(onlyMessage);
      console.log(chalk.bgGrey(chalk.yellow(instructions)));
    } catch (error) {
      console.error(chalk.red('Error creating project structure.'));
      console.error(chalk.red(error));
    }
  };

  // Main setup function
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
      console.log(chalk.bgYellow(chalk.black('Starting setup...')));
      const answers = await askQuestions();
      await createProjectStructure(
        answers.projectName,
        answers.output,
        answers.typescript,
        answers.example,
      );
    }, 450);
  };

  await runSetup();
})();
