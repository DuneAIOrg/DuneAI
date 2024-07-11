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
exports.disposeModel = exports.ask = void 0;
const gpt = __importStar(require("gpt4all"));
const throttling_1 = require("../utils/throttling");
// Load or get the already loaded model
function getModel(modelPath_1) {
    return __awaiter(this, arguments, void 0, function* (modelPath, device = "cpu") {
        let model = null;
        try {
            model = yield gpt.loadModel(modelPath, { device });
            console.log("Model loaded successfully:", modelPath);
        }
        catch (error) {
            console.error("Failed to load model:", error);
            throw error;
        }
        return model;
    });
}
const getCompletion = (content, options) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const modelPath = options.model;
    const modelInstance = yield getModel(modelPath, options.device || "cpu");
    const chat = yield modelInstance.createChatSession();
    try {
        const completion = yield gpt.createCompletion(chat, content, options);
        (0, exports.disposeModel)(modelInstance, modelPath);
        return completion.choices[0].message.content;
    }
    catch (error) {
        console.error("Error during completion:", error);
        (0, exports.disposeModel)(modelInstance, modelPath);
        throw error;
    }
});
const ask = (prompt, options) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, throttling_1.throttledOperation)(() => getCompletion(prompt, options), {
        id: prompt,
    }));
});
exports.ask = ask;
const disposeModel = (model, name) => {
    if (model) {
        model.dispose();
        console.log(`Model instance for ${name} disposed`);
    }
};
exports.disposeModel = disposeModel;
