"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MODELS = exports.ADAPTERS = void 0;
exports.ask = ask;
const gpt4all = __importStar(require("./gpt4all"));
const openai = __importStar(require("./openai"));
const sdwebui = __importStar(require("./sdwebui"));
exports.ADAPTERS = {
    GPT4ALL: gpt4all,
    OPENAI: openai,
    SDWEBUI: sdwebui,
};
exports.MODELS = {
    GPT_FOUR: { model: "gpt-4o", adapter: "OPENAI" },
    GPT_FOUR_BIG: { model: "gpt-4-32k", adapter: "OPENAI" },
    GPT_THREE: { model: "gpt-3.5-turbo", adapter: "OPENAI" },
    MISTRAL_7B: {
        model: "mistral-7b-openorca.gguf2.Q4_0.gguf",
        adapter: "GPT4ALL",
    },
    ORCA_MINI_3B: { model: "orca-mini-3b-gguf2-q4_0.gguf", adapter: "GPT4ALL" },
    NOUS_HERMES: {
        model: "Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf",
        adapter: "GPT4ALL",
    },
    LLAMA3XXX: {
        model: "LexiFun-Llama-3-8B-Uncensored-V1_F16.gguf",
        adapter: "GPT4ALL",
    },
    LLAMA3: {
        model: "Meta-Llama-3-8B-Instruct.Q4_0.gguf",
        adapter: "GPT4ALL",
    },
    SD: { model: "sd", adapter: "SDWEBUI" },
};
// Unified ask method that delegates to the correct adapter based on the modelKey
function ask(prompt, modelKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const adapterKey = exports.MODELS[modelKey].adapter;
        const model = exports.MODELS[modelKey].model;
        const adapter = exports.ADAPTERS[adapterKey];
        return adapter.ask(prompt, Object.assign({ model }, options));
    });
}
