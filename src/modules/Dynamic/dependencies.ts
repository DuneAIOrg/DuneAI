import { DynamicType, DynamicState, NestedObjectType } from "../types";
import { createPrompt } from "../Prompt";
import { COT } from "../constants";
import { useStore } from "../../store";

export const run = async (
  initialState: Record<string, any>,
  dynamic: DynamicType,
) => {
  const { initializeState, setContext } = useStore.getState();

  initializeState(initialState);

  // @ts-ignore
  setContext(dynamic?.context as NestedObjectType);

  if (dynamic.before) {
    const beforeResult = 
      (await dynamic.before(useStore.getState() as DynamicState)) as object;
    initializeState(beforeResult as NestedObjectType);
  }

  const strategy =
    dynamic.kind === COT
      ? runChainOfThought
      : runTreeOfThought;

  await strategy(dynamic);

  if (dynamic.after) {
    const afterResult = (await dynamic.after({
      ...useStore.getState(),
    })) as object;
    initializeState(afterResult as NestedObjectType);
  }

  return useStore.getState().state;
}

const runChainOfThought = async (dynamic: DynamicType) => {
  for (const prompt of dynamic.prompts || []) {
    const { state, context } = useStore.getState();
    const generation = await (await createPrompt(prompt)).run({
      ...state,
      context,
    } as DynamicState);
    useStore.getState().setState(
      dynamic.name, 
      generation.name, 
      generation.completion
    );
  }
}

const runTreeOfThought = async (dynamic: DynamicType) => {
  await Promise.all(dynamic.prompts.map(async (prompt) => {
    const { state, context } = useStore.getState();
    const generation = await (await createPrompt(prompt)).run({
      ...state,
      context: context as NestedObjectType,
    } as DynamicState);
    useStore.getState().setState(
      dynamic.name, 
      generation.name, 
      generation.completion
    );
  }));
}

// export interface FunctionTypes {
//   runTreeOfThought: (dynamic: DynamicType) => Promise<void>;
//   runChainOfThought: (dynamic: DynamicType) => Promise<void>;
//   run: (
//     initialState: Record<string, any>,
//     dynamic: DynamicType,
//   ) => Promise<Record<string, any>>;
// }

// export interface Constants {
//   before: Hook;
//   after: Hook;
// }

// export interface Dependencies extends FunctionTypes, Constants {}

// export const defaultDependencies: Dependencies = {
//   before: async () => {},
//   after: async () => {},
//   runChainOfThought: async (dynamic) => {
//     Logger.info(`Running ${dynamic.name} Chain of Thought Dynamic`);

//     for (const prompt of dynamic.prompts || []) {
//       const { state, context } = useStore.getState();
//       const generation = await (prompt as PromptType).run({
//         ...state,
//         context,
//       });

//       useStore.getState().setState(dynamic.name, prompt.name, generation);
//     }
//   },
//   runTreeOfThought: async (dynamic) => {
//     Logger.info(`Running ${dynamic.name} Tree of Thought Dynamic`);

//     await Promise.all(
//       (dynamic.prompts || []).map(async (prompt) => {
//         const { state, context } = useStore.getState();
//         const generation = await (prompt as PromptType).run({
//           ...state,
//           context,
//         });
//         useStore.getState().setState(dynamic.name, prompt.name, generation);
//       }),
//     );
//   },

//   async run(initialState, dynamic) {
//     const { initializeState, setContext } = useStore.getState();

//     // Initialize state and context
//     initializeState(initialState);
//     setContext(dynamic?.context);

//     if (dynamic.before) {
//       const beforeResult = (await dynamic.before({
//         ...useStore.getState(),
//       })) as object;
//       initializeState(beforeResult);
//     }

//     const strategy =
//       dynamic.kind === "chainOfThought"
//         ? this.runChainOfThought
//         : this.runTreeOfThought;

//     if (strategy) {
//       await strategy(dynamic);
//     } else {
//       Logger.error("Unknown dynamic type");
//       return {};
//     }

//     if (dynamic.after) {
//       const afterResult = (await dynamic.after({
//         ...useStore.getState(),
//       })) as object;
//       initializeState(afterResult);
//     }

//     return useStore.getState().state;
//   },
// };
