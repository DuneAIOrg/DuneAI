"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inverter = void 0;
const Dynamic_1 = require("../../Dynamic");
const index_1 = require("../index");
const defaultCriteria = '"truthy" or "falsey"';
const prompt = (criteria, completion) => `is this criteria, ${criteria}, false for this completion: ${completion}? 
  respond with t for true or f for false.`;
const Inverter = async ({ completion, criteria }) => {
    var _a, _b;
    const dynamic = (0, Dynamic_1.createDynamic)('InverterCybernetic', {}, [prompt(criteria || defaultCriteria, completion)]);
    const result = await dynamic.run({});
    return ((_b = (_a = result === null || result === void 0 ? void 0 : result['InverterCybernetic']) === null || _a === void 0 ? void 0 : _a[index_1.LAMBDA]) === null || _b === void 0 ? void 0 : _b.includes('t')) || false;
};
exports.Inverter = Inverter;
