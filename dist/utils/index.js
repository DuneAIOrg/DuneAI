"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectify = exports.attemptObjectification = exports.interpolateIteration = exports.shuffle = exports.retryOperation = exports.wait = void 0;
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
// @ts-ignore
const interpolateIteration = function (content, params) {
    const keys = Object.keys(params);
    const values = Object.values(params);
    return new Function(...keys, `return \`${content}\`;`)(...values);
};
exports.interpolateIteration = interpolateIteration;
const attemptObjectification = (content) => {
    // check if the object can be objectified
};
exports.attemptObjectification = attemptObjectification;
const objectify = (content) => {
    // check if the content string is a valid json object,
    // if so, return it as a js object
};
exports.objectify = objectify;
