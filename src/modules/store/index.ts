import { createStore } from "zustand/vanilla";
import { createPersistMiddleware } from "../../middleware";
import type { DynamicState, NestedObjectType } from "../types";

export const useStore = createStore<DynamicState>(
  createPersistMiddleware("state.json")((set: Function) => ({
    state: {},
    context: {},
    setState: (dynamicName: string, key: string, value: any) =>
      set((store: { state: Record<string, any> }) => ({
        state: {
          ...store.state,
          [dynamicName]: {
            ...(store.state[dynamicName] || {}),
            [key]: value,
          },
        },
      })),
    setContext: (context: NestedObjectType) =>
      set(
        (store: {
          state: DynamicState["state"];
          context: DynamicState["context"];
        }) => ({
          context: {
            ...store.context,
            ...context,
          },
        }),
      ),
    initializeState: (initialState: NestedObjectType) =>
      set((store: DynamicState) => ({
        state: {
          ...store.state,
          ...initialState,
        },
      })),
  })),
);
