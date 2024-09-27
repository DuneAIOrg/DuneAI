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
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'openai_api_key';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4o-mini';
const getCompletion = async (content, options) => {
    var _a;
    const params = Object.assign({ messages: [{ role: "user", content }], model: options.model || DEFAULT_MODEL }, options);
    // @ts-ignore
    const { adapter: _ } = params, openaiParams = __rest(params, ["adapter"]);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(openaiParams),
    });
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    const chatCompletion = await response.json();
    return {
        content: (_a = chatCompletion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content,
        meta: chatCompletion
    };
};
const ask = async (prompt, options) => {
    const result = await getCompletion(prompt, options);
    return { content: result.content, meta: result.meta };
};
exports.ask = ask;
