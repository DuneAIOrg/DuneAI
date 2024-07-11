"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const vanilla_1 = require("zustand/vanilla");
const middleware_1 = require("../middleware");
exports.useStore = (0, vanilla_1.createStore)((0, middleware_1.createPersistMiddleware)("state.json")((set) => ({
    generations: {},
    context: {},
    setGeneration: (dynamicName, promptName, generation) => set((state) => ({
        generations: Object.assign(Object.assign({}, state.generations), { [dynamicName]: Object.assign(Object.assign({}, state.generations[dynamicName]), { [promptName]: generation }) }),
    })),
    setContext: (context) => set((state) => ({
        context: Object.assign(Object.assign({}, state.context), context),
    })),
})));
