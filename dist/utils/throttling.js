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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttledOperation = exports.MAX_CONCURRENT = exports.RETRY_COUNT = exports.DELAY = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const _1 = require("./");
exports.DELAY = 500;
exports.RETRY_COUNT = 3;
exports.MAX_CONCURRENT = 5;
// Setup for the bottleneck limiter
const limiter = new bottleneck_1.default({
    minTime: exports.DELAY,
    maxConcurrent: exports.MAX_CONCURRENT,
});
// Generalized function to perform throttled operations with retries
const throttledOperation = (operation, options) => __awaiter(void 0, void 0, void 0, function* () {
    return yield limiter.schedule(() => (0, _1.retryOperation)(operation, exports.DELAY, exports.RETRY_COUNT), {
        priority: 1,
        weight: 1,
        id: (options === null || options === void 0 ? void 0 : options.id) || "default_id",
    });
});
exports.throttledOperation = throttledOperation;
