"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamic = void 0;
const dependencies_1 = require("./dependencies");
const constants_1 = require("../constants");
const createDynamic = (options, context, prompts, overrides) => {
    var _a, _b;
    let newDynamic;
    if (typeof options === "string") {
        newDynamic = {
            name: options,
            kind: constants_1.COT,
            context: context,
            prompts: prompts,
            log: false,
        };
    }
    else if (typeof options === "object") {
        newDynamic = {
            name: (_a = options.name) !== null && _a !== void 0 ? _a : constants_1.LAMBDA,
            kind: options.kind === constants_1.TOT ? constants_1.TOT : constants_1.COT,
            context: options.context,
            prompts: options.prompts,
            log: (_b = options.log) !== null && _b !== void 0 ? _b : false,
            before: options.before,
            after: options.after,
        };
    }
    else {
        throw new Error("Invalid dynamic params");
    }
    return Object.assign(Object.assign({}, newDynamic), { overrides: overrides !== null && overrides !== void 0 ? overrides : overrides, run: (initialState) => (0, dependencies_1.run)(initialState, newDynamic) });
};
exports.createDynamic = createDynamic;
