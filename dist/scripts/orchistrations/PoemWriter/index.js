"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const duneai_1 = require("duneai");
const ideaCount = 3;
const scale = 100;
const models = ['gpt-4o', 'gpt-4', 'gpt-4o-mini'];
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Come up with a list of poem ideas from each model and put them in a list.
    const prompt = 'Write me a list of {{ context.ideaCount }} poem ideas, only the list, comma separated';
    const PoemIdeaDynamic = (0, duneai_1.createDynamic)('PoemIdeaDynamic', { ideaCount }, models.map((model) => ({
        name: model,
        content: prompt,
        model,
        kind: duneai_1.TOT,
        log: true
    })));
    const ideas = yield PoemIdeaDynamic.run({});
    const ideasArray = Object.values(ideas.PoemIdeaDynamic)
        .join(',').split(',').map((idea) => idea.trim());
    // Create a prompt for each poem idea and write a poem about it
    const poemPrompts = models.map((model) => ideasArray.map((idea) => ({
        name: `${model}-${idea}`,
        content: `Without mentioning the title, write a poem about: ${idea}`,
        model,
    })));
    const PoemWriterDynamic = (0, duneai_1.createDynamic)({
        name: 'PoemWriterDynamic',
        prompts: poemPrompts.reduce((acc, val) => acc.concat(val), []),
        kind: duneai_1.TOT,
        log: true
    });
    const poemResults = yield PoemWriterDynamic.run({});
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
}))();
