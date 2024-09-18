"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAMBDA = exports.Selector = exports.Accumulator = exports.BaseCybernetic = void 0;
const Accumulator_1 = require("./Accumulator");
Object.defineProperty(exports, "Accumulator", { enumerable: true, get: function () { return Accumulator_1.Accumulator; } });
const Selector_1 = require("./Selector");
Object.defineProperty(exports, "Selector", { enumerable: true, get: function () { return Selector_1.Selector; } });
// import { Inverter } from "./Inverter";
// import { ThinkingMachine } from "./ThinkingMachine";
const LAMBDA = "λ";
exports.LAMBDA = LAMBDA;
// Base cybernetic function that could be extended or used for shared functionality
const BaseCybernetic = (prompt, options) => ({
    prompt,
    options,
});
exports.BaseCybernetic = BaseCybernetic;
