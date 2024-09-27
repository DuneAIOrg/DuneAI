"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("./openai");
const gpt4all_1 = require("./gpt4all");
exports.default = { openai: openai_1.ask, gpt4all: gpt4all_1.ask };
