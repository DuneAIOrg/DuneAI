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
      (await dynamic.before(useStore.getState().state as DynamicState)) as object;
    initializeState(beforeResult as NestedObjectType);
  }

  const strategy =
    dynamic.kind === COT
      ? runChainOfThought
      : runTreeOfThought;

  await strategy(dynamic);

  if (dynamic.after) {
    const afterResult = (await dynamic.after({
      ...useStore.getState().state,
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
