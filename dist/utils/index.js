"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countTokens = exports.shuffle = exports.retryOperation = exports.wait = void 0;
const tiktoken_1 = __importDefault(require("tiktoken"));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
exports.wait = wait;
const retryOperation = (operation, delay, retries) => new Promise((resolve, reject) => {
    return operation()
        .then(resolve)
        .catch((reason) => {
        if (retries > 0) {
            return (0, exports.wait)(delay)
                .then(exports.retryOperation.bind(null, operation, delay, retries - 1))
                .then(resolve)
                .catch(reject);
        }
        return reject(reason);
    });
});
exports.retryOperation = retryOperation;
const shuffle = (array) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};
exports.shuffle = shuffle;
const countTokens = (content, model) => {
    let enc;
    let tokenCount;
    let modelUsed = model;
    try {
        enc = tiktoken_1.default.encoding_for_model(model);
        tokenCount = enc.encode(content).length;
    }
    catch (_a) {
        modelUsed = "gpt-4o";
        enc = tiktoken_1.default.encoding_for_model(modelUsed);
        tokenCount = enc.encode(content).length;
    }
    finally {
        enc === null || enc === void 0 ? void 0 : enc.free();
    }
    return {
        modelUsed,
        tokenCount,
    };
};
exports.countTokens = countTokens;
