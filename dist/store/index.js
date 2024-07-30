"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const vanilla_1 = require("zustand/vanilla");
const middleware_1 = require("../middleware");
exports.useStore = (0, vanilla_1.createStore)((0, middleware_1.createPersistMiddleware)("state.json")((set) => ({
    state: {},
    setState: (dynamicName, key, value) => set((state) => ({
        state: Object.assign(Object.assign({}, state.state), { [dynamicName]: Object.assign(Object.assign({}, state.state[dynamicName]), { [key]: value }) }),
    })),
    setContext: (context) => set((state) => ({
        state: Object.assign(Object.assign({}, state.state), { context: Object.assign(Object.assign({}, state.state.context), context) }),
    })),
})));
