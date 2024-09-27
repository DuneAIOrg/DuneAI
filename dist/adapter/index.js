"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
const providers_1 = __importDefault(require("./providers"));
const throttle_1 = require("./throttle");
const DEFAULT_ADAPTER = process.env.DEFAULT_ADAPTER || 'openai';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4o-mini';
// Unified ask method that delegates to the correct adapter based on the modelKey.
// Also applies throttle that reflects env variable settings.
const ask = async (prompt, adapterName = DEFAULT_ADAPTER, modelName = DEFAULT_MODEL, options) => {
    const adapter = providers_1.default[adapterName];
    if (typeof adapter !== 'function') {
        throw new TypeError(`Adapter ${adapterName} is not valid, here are the available adapters: ${Object.keys(providers_1.default).join(', ')}`);
    }
    const randomId = Math.floor(Math.random() * 1000000);
    return await (0, throttle_1.throttle)(() => adapter(prompt, Object.assign({ model: modelName }, options)), { id: `ask_operation_${randomId}` });
};
exports.ask = ask;
