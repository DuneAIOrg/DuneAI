export type DynamicTypeKind = "chainOfThought" | "treeOfThought";
export type Adapter = "GPT4ALL" | "OPENAI" | "SDWEBUI";

export type Hook = (state: Record<string, any>) => void | Promise<void> | any;
export type AIModel = string;

export type PromptType = {
  name: string;
  run: (state: Record<string, any>) => Promise<string>;
  content?: string;
  options?: object;
  spice?: {
    iteration?: number;
    iterationValue?: string;
  };
  model?: AIModel;
  adapter?: Adapter;
};

export type DynamicType = {
  name: string;
  kind: DynamicTypeKind;
  run: (
    initialState?: Record<string, any>,
    dynamic?: DynamicType,
  ) => Promise<Record<string, any>>;
  prompts?:
    | (string | KVP | PromptType)[]
    | ((input: string | KVP | PromptType) => PromptType)[];
  context?: any;
  before?: Hook;
  after?: Hook;
  model?: AIModel;
  adapter?: Adapter;
};

export type IterationOptions = {
  iterations?: number;
  collectionKey?: () => string;
  collection?: any[];
};

export interface NestedObject {
  [key: string]: unknown | NestedObject;
}

export interface AppState {
  state: Record<string, any>;
  context: NestedObject;
  setState: (dynamicName: string, key: string, value: any) => void;
  setContext: (context: NestedObject) => void;
  initializeState: (initialState: Record<string, any>) => void;
}

export interface KVP {
  [key: string]: string | undefined;
}
