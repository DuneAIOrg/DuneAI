"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const vanilla_1 = require("zustand/vanilla");
const middleware_1 = require("../middleware");
exports.useStore = (0, vanilla_1.createStore)((0, middleware_1.createPersistMiddleware)("state.json")((set) => ({
    state: {},
    context: {},
    setState: (dynamicName, key, value, spice) => set((store) => {
        var _a;
        const newState = Object.assign(Object.assign({}, store.state), { [dynamicName]: Object.assign(Object.assign({}, (store.state[dynamicName] || {})), { [key]: value }) });
        if (spice) {
            return {
                state: newState,
                shadowState: Object.assign(Object.assign({}, store.shadowState), { [dynamicName]: Object.assign(Object.assign({}, (((_a = store.shadowState) === null || _a === void 0 ? void 0 : _a[dynamicName]) || {})), { [key]: { value, spice } }) }),
            };
        }
        return { state: newState };
    }),
    setContext: (context) => set((store) => ({
        context: Object.assign(Object.assign({}, store.context), context),
    })),
    initializeState: (initialState) => set((store) => ({
        state: Object.assign(Object.assign({}, store.state), initialState),
    })),
})));
