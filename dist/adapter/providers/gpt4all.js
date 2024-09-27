"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
require("dotenv/config");
const getBaseUrl = (options) => {
    const url = new URL('http://localhost:4891');
    if (options === null || options === void 0 ? void 0 : options.host) {
        url.host = options.host;
    }
    if (options === null || options === void 0 ? void 0 : options.protocol) {
        url.protocol = options.protocol;
    }
    if (options === null || options === void 0 ? void 0 : options.port) {
        url.port = options.port.toString();
    }
    return url.toString();
};
const getCompletion = async (content, options) => {
    var _a, _b, _c, _d;
    const params = Object.assign({ messages: [{ role: "user", content }], max_tokens: 512, temperature: 0.45 }, options);
    // @ts-expect-error
    const { adapter: _ } = params, gpt4allParams = __rest(params, ["adapter"]);
    const apiBaseUrl = getBaseUrl(options);
    const response = await fetch(apiBaseUrl + 'v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify(gpt4allParams),
    });
    if (!response.ok) {
        throw new Error(`GTP4All API error: ${response.statusText}`);
    }
    const chatCompletion = await response.json();
    return {
        content: (_d = (_c = (_b = (_a = chatCompletion === null || chatCompletion === void 0 ? void 0 : chatCompletion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '',
        meta: chatCompletion
    };
};
const ask = async (prompt, options) => {
    const result = await getCompletion(prompt, options);
    return { content: result.content, meta: result.meta };
};
exports.ask = ask;
