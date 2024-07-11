export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (state: State) => void | Promise<void>;

export type PromptType = {
  name: string;
  content: string;
  model: AIModel;
  run: (dynamic: DynamicType, input?: any) => Promise<string>;
  context?: Record<string, any>;
  iteratable?:
    | false
    | {
        iteration?: number;
        iterationValue?: string;
        collectionKey?: string;
      };
};

export type DynamicType = {
  name: string;
  kind?: DynamicTypeKind;
  prompts: (PromptType | Record<string, string>)[];
  context?: any;
  run: (dynamic?: DynamicType, input?: any) => Promise<void | any>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type IterationOptions = {
  iterations?: number;
  collectionKey?: () => string;
  collection?: any[];
};
