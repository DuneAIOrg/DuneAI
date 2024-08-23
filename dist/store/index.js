"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const vanilla_1 = require("zustand/vanilla");
const middleware_1 = require("../middleware");
exports.useStore = (0, vanilla_1.createStore)((0, middleware_1.createPersistMiddleware)("state.json")((set) => ({
    state: {},
    context: {},
    setState: (dynamicName, key, value) => set((store) => ({
        state: Object.assign(Object.assign({}, store.state), { [dynamicName]: Object.assign(Object.assign({}, (store.state[dynamicName] || {})), { [key]: value }) }),
    })),
    setContext: (context) => set((store) => ({
        context: Object.assign(Object.assign({}, store.context), context),
    })),
    initializeState: (initialState) => set((store) => ({
        state: Object.assign(Object.assign({}, store.state), initialState),
    })),
})));
