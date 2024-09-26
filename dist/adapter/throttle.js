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
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = exports.MAX_CONCURRENT = exports.MAX_RPM = exports.RETRY_COUNT = exports.DELAY = void 0;
const utils_1 = require("../utils");
require("dotenv/config");
exports.DELAY = parseInt(process.env.DELAY || '500', 10);
exports.RETRY_COUNT = parseInt(process.env.RETRY_COUNT || '3', 10);
exports.MAX_RPM = parseInt(process.env.MAX_RPM || '10000', 10);
exports.MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT || exports.MAX_RPM.toString(), 10);
let currentConcurrent = 0;
const queue = [];
const processQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (queue.length === 0 || currentConcurrent >= exports.MAX_CONCURRENT) {
        return;
    }
    const { operation, resolve, reject } = queue.shift();
    currentConcurrent++;
    try {
        const result = yield (0, utils_1.retryOperation)(operation, exports.DELAY, exports.RETRY_COUNT);
        resolve(result);
    }
    catch (error) {
        reject(error);
    }
    finally {
        currentConcurrent--;
        setTimeout(processQueue, 60000 / exports.MAX_RPM);
    }
});
// Generalized function to perform throttled operations with retries
const throttle = (operation, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        queue.push({ operation, resolve, reject });
        processQueue();
    });
});
exports.throttle = throttle;
