import { run } from "./dependencies";
import { COT, TOT, LAMBDA } from "../constants";
import { 
  DynamicType, 
  NestedObjectType, 
  PromptParamsType, 
  DynamicOptionsParamType, 
  DynamicState
} from "../types";

export const createDynamic = (
  options: DynamicOptionsParamType | string,
  context?: NestedObjectType,
  prompts?: Array<PromptParamsType>,
  overrides?: Partial<PromptParamsType>
): DynamicType => {
  let newDynamic: DynamicType;

  if (typeof options === "string") {
    newDynamic = {
      name: options as string,
      kind: COT,
      context: context as NestedObjectType,
      prompts: prompts as Array<PromptParamsType>,
    } as DynamicType;
  } else if (typeof options === "object") {
    newDynamic = {
      name: options.name ?? LAMBDA,
      kind: options.kind === TOT ? TOT : COT,
      context: options.context as NestedObjectType,
      prompts: options.prompts as Array<PromptParamsType>,
    } as DynamicType;
  } else {
    throw new Error("Invalid dynamic params");
  }

  return {
    ...newDynamic,
    overrides: overrides ?? overrides,
    run: (initialState: Partial<DynamicState>): Promise<Partial<DynamicState>> => 
      run(initialState, newDynamic),
  }
}

// const PickLocale = createDynamic("PickLocale", context, [
//   {
//     name: "Continent",
//     content: Continent,
//     model: "gpt-4o-mini",
//   },
//   { Languages },
// ]);
// const RespondToAll = createDynamic("RespondToAll", context, [{ Respond }]);

// export const SayHelloWorld: DynamicType = createDynamic({
//   name: "SayHelloWorld",
//   kind: TOT,
//   context,
//   model: "gpt-4o-mini",
//   adapter: "OPENAI",
//   prompts: Iterator([{ HelloWorld }], { iterations: COUNT }),
//   before: async ({ state }) => await PickLocale.run(state),
//   after: async ({ state }) => await RespondToAll.run(state),
// });



// export const createDynamic = (
//   params: Partial<DynamicType> | string,
//   context?: NestedObject,
//   prompts: Partial<Dependencies> | Array<Record<string, string>> = {},
//   overrides: Partial<Dependencies> = {},
// ): DynamicType => {
//   let dynamicParams: Partial<DynamicType>;
//   let dynamicOverrides: Partial<Dependencies>;

//   if (typeof params === "string") {
//     dynamicParams = {
//       name: params,
//       context: context as NestedObject,
//       prompts: prompts as Array<Record<string, string>>,
//     };
//     dynamicOverrides = overrides;
//   } else {
//     dynamicParams = params;
//     dynamicOverrides = prompts as Partial<Dependencies>;
//   }

//   const dynamicDependencies: Dependencies = {
//     ...defaultDependencies,
//     ...dynamicOverrides,
//   };

//   const { setContext } = useStore.getState();
//   setContext(context ?? dynamicParams.context);

//   const instantiatedPrompts: PromptType[] =
//     dynamicParams?.prompts?.map((prompt) => {
//       const model = dynamicParams.model || MODEL;
//       const adapter = dynamicParams.adapter || (ADAPTER as Adapter);
//       if ("name" in prompt && "content" in prompt) {
//         return createPrompt({
//           model,
//           adapter,
//           ...prompt,
//         });
//       } else {
//         const key = Object.keys(prompt)[0];
//         const value = (prompt as Record<string, string>)[key];
//         return createPrompt({ name: key, content: value, model, adapter });
//       }
//     }) || [];

//   return {
//     kind: dynamicParams.kind ?? COT,
//     name: dynamicParams.name ?? "defaultDynamic",
//     model: dynamicParams.model ?? MODEL,
//     adapter: dynamicParams.adapter ?? (ADAPTER as Adapter),
//     ...dynamicParams,
//     prompts: instantiatedPrompts,
//     run: function (initialState) {
//       return dynamicDependencies.run(
//         initialState || {},
//         this as unknown as DynamicType,
//       );
//     },
//     before: dynamicParams.before || dynamicDependencies.before,
//     after: dynamicParams.after || dynamicDependencies.after,
//   };
// };

// const Dynamic = (
//   params: DynamicType | string,
//   context: NestedObject = {},
//   prompts: Array<Record<string, string>> | Partial<Dependencies> = {},
//   overrides: Partial<Dependencies> = {},
// ) => createDynamic(params, context, prompts, overrides);

// export default Dynamic;
