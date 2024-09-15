import { KVP } from "../../../types";
import { createDynamic} from "../../Dynamic";

const prompt = (invert: boolean, condition: string) => `
  given the following statement, determine if it is true or false:
  {{ context.statement }}

  ${condition.length > 0
    ? `given that statement and this condition, determine if the statement is true or false: ${condition}` 
    : ''
  }

  ${invert 
    ? 'if the statement is true, return false. if the statement is false, return true' 
    : ''
  }

  return true or false, any other response is invalid
`;

export const Inverter = async (
  completion: string | ((state: KVP, context: KVP) => string),
  options: KVP,
): Promise<boolean> => {
  const InverterDynamic = createDynamic('Inverter', 
    { statement: completion }, 
    [{ prompt: prompt(!!options?.invert || false, options?.condition || '') }]
  );
  const result = await InverterDynamic.run();
  const resultBoolean = 
    result.state.Inverter.prompt === 'true' || 
    result.state.Inverter.prompt === 'false' 
      ? result.state.Inverter.prompt === 'true' 
      : false;
  return resultBoolean;
};