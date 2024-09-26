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
exports.Inverter = void 0;
const Dynamic_1 = require("../../Dynamic");
const index_1 = require("../index");
const defaultCriteria = '"truthy" or "falsey"';
const prompt = (criteria, completion) => `is this criteria, ${criteria}, false for this completion: ${completion}? 
  respond with t for true or f for false.`;
const Inverter = (_a) => __awaiter(void 0, [_a], void 0, function* ({ completion, criteria }) {
    var _b, _c;
    const dynamic = (0, Dynamic_1.createDynamic)('InverterCybernetic', {}, [prompt(criteria || defaultCriteria, completion)]);
    const result = yield dynamic.run({});
    return ((_c = (_b = result === null || result === void 0 ? void 0 : result['InverterCybernetic']) === null || _b === void 0 ? void 0 : _b[index_1.LAMBDA]) === null || _c === void 0 ? void 0 : _c.includes('t')) || false;
});
exports.Inverter = Inverter;
