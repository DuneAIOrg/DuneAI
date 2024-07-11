import fs from "fs";
import path from "path";

const persistStateToFile = (state: any, filePath: string) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  fs.writeFileSync(absolutePath, JSON.stringify(state, null, 2));
};

export const createPersistMiddleware =
  (filePath: string) => (config: any) => (set: any, get: any, api: any) => {
    const newSet = (partial: any, replace: boolean) => {
      const nextState =
        typeof partial === "function" ? partial(get()) : partial;
      set(nextState, replace);
      persistStateToFile(get(), filePath);
    };
    return config(newSet, get, api);
  };
