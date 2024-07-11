import { createStore } from "zustand/vanilla";
import { createPersistMiddleware } from "../middleware";

interface AppState {
  generations: Record<string, Record<string, any>>;
  context: Record<string, any>;
  setGeneration: (
    dynamicName: string,
    promptName: string,
    generation: string | object,
  ) => void;
  setContext: (context: any) => void;
}

export const useStore = createStore<AppState>(
  createPersistMiddleware("state.json")((set: Function) => ({
    generations: {},
    context: {},
    setGeneration: (
      dynamicName: string,
      promptName: string,
      generation: object | string,
    ) =>
      set((state: { generations: object }) => ({
        generations: {
          ...state.generations,
          [dynamicName]: {
            // @ts-ignore
            ...state.generations[dynamicName],
            [promptName]: generation,
          },
        },
      })),
    setContext: (context: object) =>
      set((state: { context: object }) => ({
        context: {
          ...state.context,
          ...context,
        },
      })),
  })),
);
