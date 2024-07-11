// dependencies.ts
import { PromptType, DynamicType, Hook, DynamicTypeKind } from "../../types";
import Prompt from "../Prompt";
import { useStore } from "../../store";

export interface FunctionTypes {
  runChainOfThought: (dynamic: DynamicType) => Promise<Record<string, any>>;
  runTreeOfThought: (dynamic: DynamicType) => Promise<Record<string, any>>;
  run: (dynamic: DynamicType) => Promise<Record<string, any>>;
}

export interface Constants {
  beforeLife: Hook;
  afterDeath: Hook;
}

export interface Dependencies extends FunctionTypes, Constants {}

export const defaultDependencies: Dependencies = {
  beforeLife: async () => {
    // console.log(`beforeLife: ${JSON.stringify(context)}`);
  },
  afterDeath: async () => {
    // console.log(`afterDeath: ${JSON.stringify(context)}`);
  },

  async runChainOfThought(dynamic) {
    console.log(`Running ${dynamic.name} Dynamic`);
    const { setGeneration } = useStore.getState();

    for (const prompt of dynamic.prompts) {
      const generation = await (prompt as PromptType).run(dynamic);
      setGeneration(dynamic.name, prompt.name, generation);
    }

    const result = useStore.getState().generations[dynamic.name];
    return result;
  },

  async runTreeOfThought(dynamic) {
    console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);
    const { getState } = useStore;
    const { setGeneration } = getState();
    let result = {
      ...getState().generations[dynamic.name],
      ...dynamic.context,
    };

    const promptResults = await Promise.all(
      dynamic.prompts.map((prompt) => {
        const newPrompt = Prompt().create(prompt);
        return newPrompt.run(dynamic);
      }),
    );

    promptResults.forEach((output) => {
      if (typeof output === "object" && output !== null) {
        const name = Object.keys(output)[0];
        result = { ...result };
        setGeneration(dynamic.name, name, output[name]);
      }
    });

    return result;
  },

  async run(dynamic) {
    const { getState } = useStore;
    const { setGeneration } = getState();

    if (dynamic.beforeLife) {
      const beforeLifeResult = await dynamic.beforeLife(
        getState().generations[dynamic.name],
      );
      // @ts-ignore
      if (beforeLifeResult) {
        setGeneration(dynamic.name, "beforeLife", beforeLifeResult);
      }
    }

    console.log(`Starting Dynamic: ${dynamic.kind}`);

    let result: any;
    switch (dynamic.kind) {
      case "chainOfThought":
        result = await this.runChainOfThought(dynamic);
        break;
      case "treeOfThought":
        result = await this.runTreeOfThought(dynamic);
        break;
      default:
        console.error("Unknown dynamic type");
        return {};
    }

    if (dynamic.afterDeath) {
      const afterDeathResult = await dynamic.afterDeath(result);
      // @ts-ignore
      if (afterDeathResult) {
        setGeneration(dynamic.name, "afterDeath", afterDeathResult);
      }
    }

    setGeneration(dynamic.name, "context", dynamic.context);
    return result;
  },
};
