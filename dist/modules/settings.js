"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
// @ts-ignore
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getSettings = () => ({
    model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
    adapter: process.env.DEFAULT_ADAPTER || "openai",
});
exports.getSettings = getSettings;
