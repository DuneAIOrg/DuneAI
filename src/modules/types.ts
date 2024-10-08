type SimplePrompt = string;
type KeyValuePrompt = KeyValuePair;

export type PromptParamsType = 
  PromptType      | 
  SimplePrompt    | 
  KeyValuePrompt  | 
  (() => PromptType | SimplePrompt | KeyValuePrompt) |
  (() => Promise<PromptType | SimplePrompt | KeyValuePrompt>);

export type LifecycleHookType = (state: Partial<DynamicState>) => 
  void          | 
  Promise<void> | 
  Promise<Partial<DynamicState>>;

export interface KeyValuePair {
  [key: string]: 
    string | 
    number | 
    boolean;
}

export interface NestedObjectType {
  [key: string]: 
    string  | 
    number  | 
    boolean |
    NestedObjectType;
}

export interface DynamicOptionsParamType {
  kind: string;
  prompts: PromptParamsType[];
  context?: NestedObjectType;
  overrides?: Partial<PromptParamsType>;
  name?: string;
  meta?: MetaType;
  log?: boolean;
  before?: LifecycleHookType;
  after?: LifecycleHookType;
}

export type SelectorOptionsType = {
  greedy?: boolean;
  state?: DynamicState['state'];
}

export type SelectorParamsType = {
  completions: 
    string[] | 
    ((state: DynamicState['state']) => string[]);
  criteria?: 
    string |
    ((state: DynamicState['state']) => string);
  options?: SelectorOptionsType;
}

export interface SpiceType {
  sentPrompt?: string;
  seed?: number;
  currentTime?: Date;
  startedAt?: Date;
  iteration?: number;
  finishedAt?: Date;
  duration?: number;
  tokensSent?: number;
  tokensReceived?: number;
  totalTokens?: number;
  modelUsed?: string;
  adapterUsed?: string;
  raw?: KeyValuePair;
}

export interface MetaType {
  startedAt: Date;
  completedAt: Date;
  duration: number;
  tokensSent: number;
  tokensReceived: number;
  totalTokens: number;
}

export interface DynamicState {
  state: Record<string, any>;
  context: NestedObjectType;
  setState: (
    dynamicName: string, 
    promptName: string, 
    value: string, 
    spice: SpiceType | boolean
  ) => void;
  setContext: (
    dynamicName: string, 
    promptName: string, 
    value: any, 
    spice: SpiceType | boolean
  ) => void;
  initializeState: (initialState: NestedObjectType) => void;
}

export interface PromptType {
  name: string;
  model: string;
  adapter: string;
  content: string;
  completion?: string;
  spice: SpiceType;
  options: KeyValuePair;
  run: (state: DynamicState, log: boolean) => 
    Promise<PromptType>;
}

export interface DynamicType {
  name: string;
  kind: string;
  log: boolean;
  meta: MetaType;
  context: NestedObjectType;
  prompts: PromptParamsType[];
  overrides?: Partial<PromptParamsType>;
  before?: LifecycleHookType;
  after?: LifecycleHookType;
  exportState: () => DynamicState;
  run: (state?: NestedObjectType) => 
    Promise<Partial<DynamicState>>;
}

export interface SelectorType {
  (params: SelectorParamsType): Promise<
    [number, string][] |
    [number, string]
  >;
}