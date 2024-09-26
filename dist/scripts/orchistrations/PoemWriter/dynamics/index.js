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
exports.SayHelloWorld = void 0;
const path = __importStar(require("path"));
// @ts-ignore
const duneai_1 = require("duneai");
const fullPath = path.resolve(__dirname, "../prompts/Prompts.prompt");
const { Continent, Languages, HelloWorld, Respond } = (0, duneai_1.importPrompts)(fullPath);
const COUNT = 4;
const context = { count: COUNT };
const PickLocale = (0, duneai_1.createDynamic)("PickLocale", context, [
    {
        name: "Continent",
        content: Continent,
        model: "gpt-4o-mini",
    },
    { Languages },
]);
const RespondToAll = (0, duneai_1.createDynamic)("RespondToAll", context, [{ Respond }]);
exports.SayHelloWorld = (0, duneai_1.createDynamic)({
    name: "SayHelloWorld",
    kind: duneai_1.TOT,
    context,
    prompts: [{ HelloWorld }],
    before: (state) => __awaiter(void 0, void 0, void 0, function* () { return yield PickLocale.run(state); }),
    after: (state) => __awaiter(void 0, void 0, void 0, function* () { return yield RespondToAll.run(state); }),
});
