import { createDynamic } from '../../Dynamic'
import { LAMBDA } from '../index'
import { 
  SelectorParamsType, 
  DynamicState, 
  SelectorOptionsType 
} from '../../types'

const defaultCriteria = '"truthy" or "falsey"'
const prompt = (criteria: string, completion: string) => 
  `is this criteria, ${criteria}, true for this completion: ${completion}? 
  respond with t for true or f for false.`

const greedySelector = async({
  completions,
  criteria
}: { 
  completions: string[], 
  criteria: string
}): Promise<[number, string] | []> => {
  let selected: [number, string] | [] = []
  for (const [index, completion] of completions.entries()) {
    const dynamic = createDynamic('SelectorCybernetic', {}, [prompt(criteria, completion)]);
    const result: DynamicState["state"] = await dynamic.run({});
    if (result?.['SelectorCybernetic']?.[LAMBDA]?.includes('t')) {
      selected = [index, completion];
      break;
    }
  }
  return Promise.resolve(selected);
}

const generousSelector = async({
  completions,
  criteria
}: { 
  completions: string[], 
  criteria: string
}): Promise<([number, string] | [])[]> => {
  const results = await Promise.all(completions.map(async (completion, index) => {
    const dynamic = createDynamic('SelectorCybernetic', {}, [prompt(criteria, completion)])
    const result: DynamicState["state"] = await dynamic.run({})
    if (result?.['SelectorCybernetic']?.[LAMBDA]?.includes('t')) {
      return [index, completion]
    }
    return [];
  }));

  return results.filter(result => result.length > 0) as [number, string][];
}

export const Selector = async({
  completions,
  criteria,
  options
}: SelectorParamsType): Promise<[number, string] | [] | ([number, string] | [])[]> => {
  const resolvedCompletions: string[] = typeof completions === 'function' 
    ? completions((options as SelectorOptionsType)?.state as DynamicState["state"]) 
    : completions;
  const resolvedCriteria: string = typeof criteria === 'function' 
    ? criteria((options as SelectorOptionsType)?.state as DynamicState["state"]) 
    : criteria || defaultCriteria;

  return options?.greedy === true || options?.greedy === undefined
    ? await greedySelector({ 
      completions: resolvedCompletions, 
      criteria: resolvedCriteria
    }) 
    : await generousSelector({ 
      completions: resolvedCompletions, 
      criteria: resolvedCriteria
    })
};
