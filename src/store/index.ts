import { createStore } from "zustand/vanilla";
import { createPersistMiddleware } from "../middleware";

interface AppState {
  state: Record<string, any>;
  setState: (dynamicName: string, key: string, value: any) => void;
  setContext: (context: any) => void;
}

export const useStore = createStore<AppState>(
  createPersistMiddleware("state.json")((set: Function) => ({
    state: {},
    setState: (dynamicName: string, key: string, value: any) =>
      set((state: { state: Record<string, any> }) => ({
        state: {
          ...state.state,
          [dynamicName]: {
            ...state.state[dynamicName],
            [key]: value,
          },
        },
      })),
    setContext: (context: object) =>
      set((state: { state: Record<string, any> }) => ({
        state: {
          ...state.state,
          context: {
            ...state.state.context,
            ...context,
          },
        },
      })),
  })),
);
