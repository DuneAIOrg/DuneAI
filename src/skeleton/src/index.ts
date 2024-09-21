import { createDynamic, Accumulator } from "../..";
import { LAMBDA, TOT } from "../../modules/constants";

const ideaCount = 50;
const scale = 100;

(async () => {

  // Come up with a list of poem ideas
  const prompt = { 
    PoemIdeas: 'Write me a list of {{ context.ideaCount }} poem ideas, only the list, comma separated'
  };
  const PoemIdeaDynamic = createDynamic('PoemIdeaDynamic', { ideaCount }, [prompt]);
  const { PoemIdeaDynamic: { PoemIdeas } } = await PoemIdeaDynamic.run({}) as any;

  // Distribute the list into an array of poem ideas
  const poemIdeas = await Accumulator({ basePrompts: [], options: { 
    completion: PoemIdeas, 
    distribute: true
  } }) as string[];

  // Create a prompt for each poem idea and write a poem about it
  const poemPrompts = poemIdeas.map((idea ) => ({ 
    [idea]: `write a poem about, don't include the title: ${idea}` 
  }));
  const PoemWriterDynamic = createDynamic({
    name: 'PoemWriterDynamic', 
    prompts: poemPrompts,
    kind: TOT
  });
  const poems = await PoemWriterDynamic.run({}) as any;

  // Rate the poems
  const justPoems = Object.values(poems.PoemWriterDynamic)
  const ratingPrompts = justPoems.map((poem, index) => ({ 
    [index]: `
      rate this poem on a scale of 1 to {{ context.scale }}, 
      consider the creativity, depth, and emotional impact, 
      only return the rating: ${poem}` 
  } ))
  const PoemRatingsDynamic = createDynamic({
    name: 'PoemRatingsDynamic', 
    prompts: ratingPrompts,
    context: { scale },
    kind: TOT
  });
  const poemRatings = await PoemRatingsDynamic.run({}) as any;

  // Sort the poems by rating and get the short list
  const sortedPoems = Object.entries(poemRatings.PoemRatingsDynamic)
    .sort(([, ratingA], [, ratingB]) => parseInt(ratingB as string) - parseInt(ratingA as string))
    .map(([index]) => justPoems[parseInt(index)]);
  const bestPoem = sortedPoems[0]

  // name the best poem
  const namePrompt = `name this poem, return only the name: ${bestPoem}`;
  const PoemNamerDynamic = createDynamic('PoemNamerDynamic', {}, [namePrompt]);
  const result = await PoemNamerDynamic.run({}) as any;
  const name = result.PoemNamerDynamic[LAMBDA];

  console.log("My favorite poem that I wrote is:\n");
  console.log(name);
  console.log("\n");
  console.log(bestPoem);
})();
