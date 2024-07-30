import { PromptType } from "../../types";
import { createPrompt } from "../Prompt";

type IterationOptions = {
  iterations?: number;
  collectionKey?: () => string;
  collection?: any[];
};

export default function Iterator(
  items: (PromptType | Record<string, string>)[],
  options: IterationOptions,
): PromptType[] {
  const { iterations, collectionKey, collection } = options;

  let iterableCollection: any[] = [];

  if (collectionKey) {
    iterableCollection = [collectionKey];
  } else if (collection) {
    // Use the provided collection
    if (Array.isArray(collection)) {
      iterableCollection = collection;
    } else {
      throw new Error("Provided collection is not an array.");
    }
  } else if (iterations !== undefined) {
    // Create a collection based on the number of iterations
    iterableCollection = Array.from({ length: iterations }, (_, i) => i + 1);
  } else {
    throw new Error(
      "Either iterations, collectionKey, or collection must be provided.",
    );
  }

  const instantiatedItems: PromptType[] = items.map((item) => {
    if ("name" in item && "content" in item) {
      return item as PromptType;
    } else {
      const key = Object.keys(item)[0];
      // @ts-ignore
      const value = item[key];
      // @ts-ignore
      return createPrompt({ name: key, content: value });
    }
  });

  const iteratedItems: PromptType[] = [];

  iterableCollection.forEach((iterationValue, index) => {
    instantiatedItems.forEach((item) => {
      const newItem = createPrompt({
        ...item,
        name: `${item.name}_iteration_${index + 1}`,
        spice: {
          iteration: index + 1,
          iterationValue,
        },
      });
      iteratedItems.push(newItem as PromptType);
    });
  });

  return iteratedItems;
}
