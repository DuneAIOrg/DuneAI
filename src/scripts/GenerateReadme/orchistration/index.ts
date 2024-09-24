import * as path from "path";
import { createDynamic, importPrompts, Accumulator, COT, PromptType, PromptParamsType } from "../../../";

const fullPath = path.resolve(__dirname, "./prompts.prompt");
const { Structure, Section, Edit } = importPrompts(fullPath);

export const StructureDynamic = (context: any) => createDynamic({
  name: 'Structure',
  kind: COT,
  context,
  prompts: [{ Structure }]
});

export const SectionDynamic = (context: any) => createDynamic({
  name: 'SectionDynamic',
  kind: COT,
  context,
  prompts: [{ [context.currentSection.trim()]: Section }]
});

export const EditDynamic = (context: any) => createDynamic({
  name: 'EditDynamic',
  kind: COT,
  context,
  prompts: [{ Edit }]
});
