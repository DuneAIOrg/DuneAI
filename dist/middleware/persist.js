"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersistMiddleware = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const persistStateToFile = (state, filePath) => {
    const absolutePath = path_1.default.resolve(process.cwd(), filePath);
    fs_1.default.writeFileSync(absolutePath, JSON.stringify(state, null, 2));
};
const createPersistMiddleware = (filePath) => (config) => (set, get, api) => {
    const newSet = (partial, replace) => {
        const nextState = typeof partial === "function" ? partial(get()) : partial;
        set(nextState, replace);
        persistStateToFile(get(), filePath);
    };
    return config(newSet, get, api);
};
exports.createPersistMiddleware = createPersistMiddleware;
