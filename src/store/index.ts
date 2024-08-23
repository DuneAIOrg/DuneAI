import { createStore } from "zustand/vanilla";
import { createPersistMiddleware } from "../middleware";
import type { AppState, NestedObject } from "../types";

export const useStore = createStore<AppState>(
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
    setContext: (context: NestedObject) =>
      set(
        (store: {
          state: AppState["state"];
          context: AppState["context"];
        }) => ({
          context: {
            ...store.context,
            ...context,
          },
        }),
      ),
    initializeState: (initialState: Record<string, any>) =>
      set((store: AppState) => ({
        state: {
          ...store.state,
          ...initialState,
        },
      })),
  })),
);
