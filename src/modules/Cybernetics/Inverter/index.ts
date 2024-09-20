import { createDynamic } from '../../Dynamic'
import { LAMBDA } from '../index'
import { 
  DynamicState
} from '../../types'

const defaultCriteria = '"truthy" or "falsey"'
const prompt = (criteria: string, completion: string) => 
  `is this criteria, ${criteria}, false for this completion: ${completion}? 
  respond with t for true or f for false.`

export const Inverter = async({
  completion,
  criteria
}: { 
  completion: string, 
  criteria?: string
}): Promise<boolean> => {
  const dynamic = createDynamic(
    'InverterCybernetic', {}, 
    [prompt(criteria || defaultCriteria, completion)]
);
  const result: DynamicState["state"] = await dynamic.run({});
  return result?.['InverterCybernetic']?.[LAMBDA]?.includes('t') || false;
};
