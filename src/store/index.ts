import { createStore } from "zustand/vanilla";
import { createPersistMiddleware } from "../middleware";
import type { DynamicState, NestedObjectType, SpiceType } from "../modules/types";

export const useStore = createStore<DynamicState>(
  createPersistMiddleware("state.json")((set: Function) => ({
    state: {},
    context: {},
    setState: (dynamicName: string, key: string, value: any, spice?: SpiceType | boolean) =>
      set((store: { state: Record<string, any>; shadowState?: Record<string, any> }) => {
        const newState = {
          ...store.state,
          [dynamicName]: {
            ...(store.state[dynamicName] || {}),
            [key]: value,
          },
        };

        if (spice !== false) {
          return {
            state: newState,
            shadowState: {
              ...store.shadowState,
              [dynamicName]: {
                ...(store.shadowState?.[dynamicName] || {}),
                [key]: { 
                  completion: value, 
                  spice: spice ?? false,
                },
              },
            },
          };
        }

        return { state: newState };
      }),
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
