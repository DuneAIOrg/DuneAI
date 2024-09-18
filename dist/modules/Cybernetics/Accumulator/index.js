"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accumulator = void 0;
const index_1 = require("../index");
const DEFAULT_DELIMITER = ",";
const pickName = (prompt) => {
    var _a, _b;
    return typeof prompt === "object" && "name" in prompt
        ? (prompt === null || prompt === void 0 ? void 0 : prompt.name) || false
        : typeof prompt === "object"
            ? ((_b = (_a = Object.entries(prompt)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[0]) || false
            : index_1.LAMBDA;
};
const pickContent = (prompt) => {
    var _a, _b;
    // @ts-ignore
    return typeof prompt === "object" && "content" in prompt
        ? (prompt === null || prompt === void 0 ? void 0 : prompt.content) || false
        : typeof prompt === "object"
            ? ((_b = (_a = Object.entries(prompt)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[1]) || false
            : false;
};
const performReplicate = (prompts, replicate, context, state) => {
    let replicateCount = 0;
    if (typeof replicate === "function") {
        replicateCount = replicate(context, state);
    }
    else if (typeof replicate === "number") {
        replicateCount = replicate;
    }
    const result = [];
    prompts.forEach((prompt) => {
        const promptName = pickName(prompt);
        const promptContent = pickContent(prompt);
        const promptObject = typeof prompt === "object"
            ? prompt
            : { [promptName || index_1.LAMBDA]: promptContent };
        for (let i = 0; i < replicateCount; i++) {
            const newKey = `${promptName}_${i}`;
            result.push(Object.assign(Object.assign({}, promptObject), { name: newKey, content: promptContent || '', spice: {
                    iteration: i,
                } }));
        }
    });
    return result;
};
// an array split by a supplied delemeter.
const performDistribute = (completion, distribute, context, state) => {
    let distributeDelimiter = DEFAULT_DELIMITER;
    if (typeof distribute === "function") {
        distributeDelimiter = distribute(context, state);
    }
    else if (typeof distribute === "string") {
        distributeDelimiter = distribute;
    }
    else if (distribute === true) {
        distributeDelimiter = DEFAULT_DELIMITER;
    }
    return completion.split(distributeDelimiter);
};
const performAggregate = (completions, aggregate, context, state) => {
    let aggregateDelimiter = DEFAULT_DELIMITER;
    if (typeof aggregate === "function") {
        aggregateDelimiter = aggregate(context, state);
    }
    else if (typeof aggregate === "string") {
        aggregateDelimiter = aggregate;
    }
    else if (aggregate === true) {
        aggregateDelimiter = DEFAULT_DELIMITER;
    }
    return completions.join(aggregateDelimiter);
};
// Changes string into an array and then back into a sorted list as an array
// Accumulator('colors: 1) blue, 2) orange, 3) red', { distribute, aggregate })
// returns: blue, orange, red
const Accumulator = (basePrompts, options) => {
    let prompts = [...basePrompts];
    let completion = options.completion || '';
    let completions;
    const { replicate, aggregate, distribute, context, state } = options;
    // valid combos:
    // replicate: true  | replicate: false | replicate: false
    // aggregate: true  | aggregate: true  | aggregate: false
    // distribute: true | distribute: true | distribute: true
    //
    // invalid combo (can't do this, replacate creates array and distribute can't consume that)
    // replicate: true
    // aggregate: false
    // distribute: true
    prompts = replicate
        ? performReplicate(prompts, replicate, context, state)
        : prompts;
    completions = distribute
        ? performDistribute(completion, distribute, context, state)
        : [completion];
    completion = aggregate
        ? performAggregate(completions, aggregate, context, state)
        : completions;
    return completion || completions || prompts;
};
exports.Accumulator = Accumulator;
