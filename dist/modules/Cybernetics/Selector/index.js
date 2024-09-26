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
exports.Selector = void 0;
const Dynamic_1 = require("../../Dynamic");
const index_1 = require("../index");
const defaultCriteria = '"truthy" or "falsey"';
const prompt = (criteria, completion) => `is this criteria, ${criteria}, true for this completion: ${completion}? 
  respond with t for true or f for false.`;
const greedySelector = (_a) => __awaiter(void 0, [_a], void 0, function* ({ completions, criteria }) {
    var _b, _c;
    let selected = [];
    for (const [index, completion] of completions.entries()) {
        const dynamic = (0, Dynamic_1.createDynamic)('SelectorCybernetic', {}, [prompt(criteria, completion)]);
        const result = yield dynamic.run({});
        if ((_c = (_b = result === null || result === void 0 ? void 0 : result['SelectorCybernetic']) === null || _b === void 0 ? void 0 : _b[index_1.LAMBDA]) === null || _c === void 0 ? void 0 : _c.includes('t')) {
            selected = [index, completion];
            break;
        }
    }
    return Promise.resolve(selected);
});
const generousSelector = (_a) => __awaiter(void 0, [_a], void 0, function* ({ completions, criteria }) {
    const results = yield Promise.all(completions.map((completion, index) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const dynamic = (0, Dynamic_1.createDynamic)('SelectorCybernetic', {}, [prompt(criteria, completion)]);
        const result = yield dynamic.run({});
        if ((_b = (_a = result === null || result === void 0 ? void 0 : result['SelectorCybernetic']) === null || _a === void 0 ? void 0 : _a[index_1.LAMBDA]) === null || _b === void 0 ? void 0 : _b.includes('t')) {
            return [index, completion];
        }
        return [];
    })));
    return results.filter(result => result.length > 0);
});
const Selector = (_a) => __awaiter(void 0, [_a], void 0, function* ({ completions, criteria, options }) {
    const resolvedCompletions = typeof completions === 'function'
        ? completions(options === null || options === void 0 ? void 0 : options.state)
        : completions;
    const resolvedCriteria = typeof criteria === 'function'
        ? criteria(options === null || options === void 0 ? void 0 : options.state)
        : criteria || defaultCriteria;
    return (options === null || options === void 0 ? void 0 : options.greedy) === true || (options === null || options === void 0 ? void 0 : options.greedy) === undefined
        ? yield greedySelector({
            completions: resolvedCompletions,
            criteria: resolvedCriteria
        })
        : yield generousSelector({
            completions: resolvedCompletions,
            criteria: resolvedCriteria
        });
});
exports.Selector = Selector;
