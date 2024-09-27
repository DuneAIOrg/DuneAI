"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
const Dynamic_1 = require("../../Dynamic");
const index_1 = require("../index");
const defaultCriteria = '"truthy" or "falsey"';
const prompt = (criteria, completion) => `is this criteria, ${criteria}, true for this completion: ${completion}? 
  respond with t for true or f for false.`;
const greedySelector = async ({ completions, criteria }) => {
    var _a, _b;
    let selected = [];
    for (const [index, completion] of completions.entries()) {
        const dynamic = (0, Dynamic_1.createDynamic)('SelectorCybernetic', {}, [prompt(criteria, completion)]);
        const result = await dynamic.run({});
        if ((_b = (_a = result === null || result === void 0 ? void 0 : result['SelectorCybernetic']) === null || _a === void 0 ? void 0 : _a[index_1.LAMBDA]) === null || _b === void 0 ? void 0 : _b.includes('t')) {
            selected = [index, completion];
            break;
        }
    }
    return Promise.resolve(selected);
};
const generousSelector = async ({ completions, criteria }) => {
    const results = await Promise.all(completions.map(async (completion, index) => {
        var _a, _b;
        const dynamic = (0, Dynamic_1.createDynamic)('SelectorCybernetic', {}, [prompt(criteria, completion)]);
        const result = await dynamic.run({});
        if ((_b = (_a = result === null || result === void 0 ? void 0 : result['SelectorCybernetic']) === null || _a === void 0 ? void 0 : _a[index_1.LAMBDA]) === null || _b === void 0 ? void 0 : _b.includes('t')) {
            return [index, completion];
        }
        return [];
    }));
    return results.filter(result => result.length > 0);
};
const Selector = async ({ completions, criteria, options }) => {
    const resolvedCompletions = typeof completions === 'function'
        ? completions(options === null || options === void 0 ? void 0 : options.state)
        : completions;
    const resolvedCriteria = typeof criteria === 'function'
        ? criteria(options === null || options === void 0 ? void 0 : options.state)
        : criteria || defaultCriteria;
    return (options === null || options === void 0 ? void 0 : options.greedy) === true || (options === null || options === void 0 ? void 0 : options.greedy) === undefined
        ? await greedySelector({
            completions: resolvedCompletions,
            criteria: resolvedCriteria
        })
        : await generousSelector({
            completions: resolvedCompletions,
            criteria: resolvedCriteria
        });
};
exports.Selector = Selector;
