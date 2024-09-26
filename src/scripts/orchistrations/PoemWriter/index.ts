// @ts-ignore
import { createDynamic, TOT } from "duneai";

const ideaCount = 3;
const scale = 100;
const models = ['gpt-4o', 'gpt-4', 'gpt-4o-mini'];

(async () => {

  // Come up with a list of poem ideas from each model and put them in a list.
  const prompt = 'Write me a list of {{ context.ideaCount }} poem ideas, only the list, comma separated';
  const PoemIdeaDynamic = createDynamic('PoemIdeaDynamic', { ideaCount }, models.map((model) => ({
    name: model,
    content: prompt,
    model,
    kind: TOT,
    log: true
  })));
  const ideas = await PoemIdeaDynamic.run({}) as any;
  const ideasArray = Object.values(ideas.PoemIdeaDynamic)
    .join(',').split(',').map((idea: string) => idea.trim());
    
  // Create a prompt for each poem idea and write a poem about it
  const poemPrompts = models.map((model) => 
    ideasArray.map((idea: string) => ({ 
      name: `${model}-${idea}`,
      content: `Without mentioning the title, write a poem about: ${idea}`, 
      model,
    }))
  )

  const PoemWriterDynamic = createDynamic({
    name: 'PoemWriterDynamic', 
    prompts: poemPrompts.reduce((acc, val) => acc.concat(val), []),
    kind: TOT,
    log: true
  });
  const poemResults = await PoemWriterDynamic.run({});

  // Rate the poems
  const rubric = `
    rate this poem on a scale of 1 to ${scale}, 
    consider the creativity, depth, and emotional impact, 
    only return the rating: ${poemResults}
  `;

  // const ratePoemsPrompts

  console.log(poemResults);

  // // Rate the poems
  // const justPoems = Object.values(poems).map(poem => poem.PoemWriterDynamic)
  // const ratingPrompts = justPoems.map((poem, index) => ({ 
  //   [index]: `
  //     rate this poem on a scale of 1 to {{ context.scale }}, 
  //     consider the creativity, depth, and emotional impact, 
  //     only return the rating: ${poem}` 
  // } ))
  // const PoemRatingsDynamic = createDynamic({
  //   name: 'PoemRatingsDynamic', 
  //   prompts: ratingPrompts,
  //   context: { scale },
  //   kind: TOT,
  //   log: true
  // });
  // const poemRatings = await PoemRatingsDynamic.run({}) as any;

  // // Sort the poems by rating and get the short list
  // const sortedPoems = Object.entries(poemRatings.PoemRatingsDynamic)
  //   .sort(([, ratingA], [, ratingB]) => parseInt(ratingB as string) - parseInt(ratingA as string))
  //   .map(([index]) => justPoems[parseInt(index)]);
  // const bestPoem = sortedPoems[0]

  // // name the best poem
  // const namePrompt = `name this poem, return only the name: ${bestPoem}`;
  // const PoemNamerDynamic = createDynamic('PoemNamerDynamic', {}, [namePrompt]);
  // const result = await PoemNamerDynamic.run({}) as any;
  // const name = result.PoemNamerDynamic[LAMBDA];

  // console.log("My favorite poem that I wrote is:\n");
  // console.log(name);
  // console.log("\n");
  // console.log(bestPoem);
})();