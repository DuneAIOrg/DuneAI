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
exports.defaultDependencies = void 0;
const store_1 = require("../../store");
const logger_1 = __importDefault(require("../../middleware/logger"));
exports.defaultDependencies = {
    before: () => __awaiter(void 0, void 0, void 0, function* () { }),
    after: () => __awaiter(void 0, void 0, void 0, function* () { }),
    runChainOfThought: (dynamic) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info(`Running ${dynamic.name} Chain of Thought Dynamic`);
        for (const prompt of dynamic.prompts || []) {
            const { state, context } = store_1.useStore.getState();
            const generation = yield prompt.run(Object.assign(Object.assign({}, state), { context }));
            store_1.useStore
                .getState()
                .setState(dynamic.name, prompt.name, generation);
        }
    }),
    runTreeOfThought: (dynamic) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info(`Running ${dynamic.name} Tree of Thought Dynamic`);
        yield Promise.all((dynamic.prompts || []).map((prompt) => __awaiter(void 0, void 0, void 0, function* () {
            const { state, context } = store_1.useStore.getState();
            const generation = yield prompt.run(Object.assign(Object.assign({}, state), { context }));
            store_1.useStore.getState().setState(dynamic.name, prompt === null || prompt === void 0 ? void 0 : prompt.name, generation);
        })));
    }),
    run(initialState, dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            const { initializeState, setContext } = store_1.useStore.getState();
            // Initialize state and context
            initializeState(initialState);
            setContext(dynamic === null || dynamic === void 0 ? void 0 : dynamic.context);
            if (dynamic.before) {
                const beforeResult = (yield dynamic.before(Object.assign({}, store_1.useStore.getState())));
                initializeState(beforeResult);
            }
            const strategy = dynamic.kind === "chainOfThought"
                ? this.runChainOfThought
                : this.runTreeOfThought;
            if (strategy) {
                yield strategy(dynamic);
            }
            else {
                logger_1.default.error("Unknown dynamic type");
                return {};
            }
            if (dynamic.after) {
                const afterResult = (yield dynamic.after(Object.assign({}, store_1.useStore.getState())));
                initializeState(afterResult);
            }
            return store_1.useStore.getState().state;
        });
    },
};
