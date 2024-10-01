import path from 'path';

// @ts-ignore
import { createDynamic, importPrompts, COT } from "src/index";

const fullPath = path.resolve(__dirname, "./prompts.prompt");
const { Structure, Section, Edit } = importPrompts(fullPath);

export const summarizePullRequest = async (changes: any) => {
  const StructureDynamic = (context: any) => createDynamic({
    name: 'Structure',
    kind: COT,
    context,
    prompts: [{
      name: 'Structure',
      content: Structure,
      adapter: 'gpt4all',
      model: 'Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf',
      // @ts-ignore
      options: {
        useLocalSession: true,
      }
    }],
  });

  const EditDynamic = (context: any) => createDynamic({
    name: 'Edit',
    kind: COT,
    context,
    prompts: [{
      name: 'Edit',
      content: Edit,
      adapter: 'gpt4all',
      model: 'Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf',
      // @ts-ignore
      options: {
        useLocalSession: true,
      }
    }],
  });

  console.log('Running StructureDynamic...');
  const structure = await StructureDynamic({ changes }).run({});

  console.log('Running EditDynamic...');
  // @ts-ignore
  const edit = await EditDynamic({ draft: structure.Structure.Structure }).run({});

  // @ts-ignore
  return edit.Edit.Edit
};