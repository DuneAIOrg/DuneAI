"use strict";
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
const processQueue = async () => {
    if (queue.length === 0 || currentConcurrent >= exports.MAX_CONCURRENT) {
        return;
    }
    const { operation, resolve, reject } = queue.shift();
    currentConcurrent++;
    try {
        const result = await (0, utils_1.retryOperation)(operation, exports.DELAY, exports.RETRY_COUNT);
        resolve(result);
    }
    catch (error) {
        reject(error);
    }
    finally {
        currentConcurrent--;
        setTimeout(processQueue, 60000 / exports.MAX_RPM);
    }
};
// Generalized function to perform throttled operations with retries
const throttle = async (operation, options) => {
    return new Promise((resolve, reject) => {
        queue.push({ operation, resolve, reject });
        processQueue();
    });
};
exports.throttle = throttle;
