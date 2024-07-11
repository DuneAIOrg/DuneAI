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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const __1 = require("../");
const throttling_1 = require("../utils/throttling");
exports.openai = new openai_1.default({
    apiKey: __1.OPENAI_API_KEY,
});
const getCompletion = (content_1, ...args_1) => __awaiter(void 0, [content_1, ...args_1], void 0, function* (content, _a = { model: "GPT_FOUR" }) {
    var _b;
    var { model } = _a, options = __rest(_a, ["model"]);
    const params = Object.assign({ messages: [{ role: "user", content }], model }, options);
    // @ts-ignore
    const chatCompletion = yield exports.openai.chat.completions.create(params);
    return (_b = chatCompletion.choices[0].message) === null || _b === void 0 ? void 0 : _b.content;
});
const ask = (prompt, options) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, throttling_1.throttledOperation)(() => getCompletion(prompt, options), {
        id: prompt,
    }));
});
exports.ask = ask;
