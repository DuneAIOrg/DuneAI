import fs from 'fs';
import {ChatSession} from "gpt4all";
import path from 'path';

// @ts-ignore
import { createDynamic, importPrompts, COT } from "src/index";


const fullPath = path.resolve(__dirname, "./prompts.prompt");
const { Structure, Section, Edit } = importPrompts(fullPath);

export const summarizePullRequest = async (session: ChatSession) => {
  const sourceDir = path.resolve(process.cwd(), 'src');

  const StructureDynamic = (context: any) => createDynamic({
    name: 'StructureDynamic',
    kind: COT,
    context,
    prompts: [{
      Structure,
      adapter: 'gpt4all',
      model: 'n/a',
      // @ts-ignore
      options: {
        session
      }
    }],
  });

  const SectionDynamic = (context: any) => createDynamic({
    name: 'SectionDynamic',
    kind: COT,
    context,
    prompts: [{
      [context.currentSection.trim()]: Section,
      adapter: 'gpt4all',
      model: 'n/a',
      // @ts-ignore
      options: {
        session
      }
    }],
  });

  const EditDynamic = (context: any) => createDynamic({
    name: 'EditDynamic',
    kind: COT,
    context,
    prompts: [{
      Edit,
      adapter: 'gpt4all',
      model: 'n/a',
      // @ts-ignore
      options: {
        session
      }
    }],
  });

  // Function to read the source code files
  const readSourceFiles = (dir: string): string[] => {
    let results: string[] = [];
    const gitignorePath = path.resolve(sourceDir, '../.gitignore');
    const gitignorePatterns = fs.readFileSync(gitignorePath, 'utf8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((pattern) => new RegExp(pattern.replace(/\*/g, '.*')));

    const isIgnored = (file: string) => {
      return gitignorePatterns.some((pattern) => pattern.test(file));
    };

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      if (isIgnored(file)) {
        return;
      }
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(readSourceFiles(file));
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(file);
      }
    });
    return results;
  };

  // Function to extract relevant information from the source code
  const extractInfoFromSource = async (files: string[]): Promise<string> => {
    let info = '';
    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      info += `\n\n### ${file}\n\`\`\`typescript\n${content}\n\`\`\`\n`;
    });
    return info;
  };

  // Read all source files
  const sourceFiles = readSourceFiles(sourceDir);

  // Extract information from the source files
  const extractedInfo = await extractInfoFromSource(sourceFiles);

  const structure = await StructureDynamic({ extractedInfo }).run({});
  let allSections = '';
  // @ts-ignore
  for (const rawCurrentSection of structure.Structure.Structure.split(',')) {
    const currentSection = rawCurrentSection.trim()
    const sectionContent = await SectionDynamic({ extractedInfo, structure, currentSection, allSections }).run({});
    // @ts-ignore
    allSections += sectionContent.SectionDynamic[currentSection];
  }

  const edit = await EditDynamic({ allSections }).run({});
  // @ts-ignore
  return edit.EditDynamic.Edit
};