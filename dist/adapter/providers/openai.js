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
const getCompletion = (content, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = Object.assign({ messages: [{ role: "user", content }], model: options.model || DEFAULT_MODEL }, options);
    // @ts-ignore
    const { adapter: _ } = params, openaiParams = __rest(params, ["adapter"]);
    const response = yield fetch('https://api.openai.com/v1/chat/completions', {
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
    const chatCompletion = yield response.json();
    return {
        content: (_a = chatCompletion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content,
        meta: chatCompletion
    };
});
const ask = (prompt, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getCompletion(prompt, options);
    return { content: result.content, meta: result.meta };
});
exports.ask = ask;
