export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (state: Record<string, any>) => void | Promise<void> | any;

export type PromptType = {
  name: string;
  model: AIModel;
  run: (state: Record<string, any>) => Promise<string>;
  content?: string;
  options?: object;
  spice?: {
    iteration?: number;
    iterationValue?: string;
  };
};

export type DynamicType = {
  name: string;
  kind: DynamicTypeKind;
  run: (
    initialState?: Record<string, any>,
    dynamic?: DynamicType,
  ) => Promise<Record<string, any>>;
  prompts?: (PromptType | Record<string, string>)[];
  context?: any;
  before?: Hook;
  after?: Hook;
};

export type IterationOptions = {
  iterations?: number;
  collectionKey?: () => string;
  collection?: any[];
};
