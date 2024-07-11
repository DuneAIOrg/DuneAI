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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
const node_sd_webui_1 = __importDefault(require("node-sd-webui"));
const throttling_1 = require("../utils/throttling");
const sdWebUI = (0, node_sd_webui_1.default)({
    apiUrl: "http://127.0.0.1:7860",
});
const generateImage = (prompt_1, ...args_1) => __awaiter(void 0, [prompt_1, ...args_1], void 0, function* (prompt, options = {}) {
    try {
        // Include the options in the API call
        const result = yield sdWebUI.txt2img(Object.assign({ prompt }, options));
        return result; //.imageUrl; // Adjust based on the actual API response
    }
    catch (error) {
        console.error("Error during image generation:", error);
        throw error;
    }
});
const ask = (prompt, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof prompt === "object") {
        options = prompt;
        prompt = options.prompt;
    }
    return yield (0, throttling_1.throttledOperation)(() => generateImage(prompt, options), {
        id: prompt, // Use prompt as the unique identifier for throttling purposes
    });
});
exports.ask = ask;
