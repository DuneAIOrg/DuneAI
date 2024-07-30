import { PromptType, DynamicType, Hook } from "../../types";
import { useStore } from "../../store";
import Logger from "../../middleware/logger";

export interface FunctionTypes {
  runTreeOfThought: (
    dynamic: DynamicType,
    initialState: Record<string, any>,
  ) => Promise<Record<string, any>>;
  runChainOfThought: (
    dynamic: DynamicType,
    initialState: Record<string, any>,
  ) => Promise<Record<string, any>>;
  run: (
    initialState: Record<string, any>,
    dynamic: DynamicType,
  ) => Promise<Record<string, any>>;
}

export interface Constants {
  before: Hook;
  after: Hook;
}

export interface Dependencies extends FunctionTypes, Constants {}

export const defaultDependencies: Dependencies = {
  before: async () => {
    Logger.info("Running before hook");
  },
  after: async () => {
    Logger.info("Running after hook");
  },

  async runChainOfThought(dynamic, initialState) {
    Logger.info(`Running ${dynamic.name} Chain of Thought Dynamic`);
    const { state: storeState, setState } = useStore.getState();
    let state = { ...initialState, ...storeState };

    for (const prompt of dynamic.prompts || []) {
      state = useStore.getState();
      const generation = await (prompt as PromptType).run(state.state);
      setState(dynamic.name, prompt.name, generation);
    }

    return useStore.getState();
  },

  async runTreeOfThought(dynamic, initialState) {
    Logger.info(`Running ${dynamic.name} Tree of Thought Dynamic`);
    const { state: storeState, setState } = useStore.getState();
    let state = { ...initialState, ...storeState };

    await Promise.all(
      (dynamic.prompts || []).map(async (prompt) => {
        const generation = await (prompt as PromptType).run(state.state);
        setState(dynamic.name, prompt.name, generation);
      }),
    );

    return useStore.getState();
  },

  async run(initialState, dynamic) {
    let state: Record<string, any> = {};
    const { state: storeState } = useStore.getState();
    state = { ...storeState, ...initialState };

    if (dynamic.before) {
      Logger.info("Running before hook");
      const beforeResult = (await dynamic.before(state)) as unknown as object;
      state = { ...state, ...beforeResult };
    }

    const strategy =
      dynamic.kind === "chainOfThought"
        ? this.runChainOfThought
        : this.runTreeOfThought;

    if (strategy) {
      state = { ...state, ...(await strategy(dynamic, state)) };
    } else {
      Logger.error("Unknown dynamic type");
      return {};
    }

    if (dynamic.after) {
      Logger.info("Running after hook");
      const afterResult = (await dynamic.after(state)) as unknown as object;
      state = { ...state, ...afterResult };
    }

    return state;
  },
};
