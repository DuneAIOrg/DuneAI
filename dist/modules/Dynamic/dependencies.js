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
    before: () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info("Running before hook");
    }),
    after: () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info("Running after hook");
    }),
    runChainOfThought(dynamic, initialState) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Running ${dynamic.name} Chain of Thought Dynamic`);
            const { state: storeState, setState } = store_1.useStore.getState();
            let state = Object.assign(Object.assign({}, initialState), storeState);
            for (const prompt of dynamic.prompts || []) {
                state = store_1.useStore.getState();
                const generation = yield prompt.run(state.state);
                setState(dynamic.name, prompt.name, generation);
            }
            return store_1.useStore.getState();
        });
    },
    runTreeOfThought(dynamic, initialState) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Running ${dynamic.name} Tree of Thought Dynamic`);
            const { state: storeState, setState } = store_1.useStore.getState();
            let state = Object.assign(Object.assign({}, initialState), storeState);
            yield Promise.all((dynamic.prompts || []).map((prompt) => __awaiter(this, void 0, void 0, function* () {
                const generation = yield prompt.run(state.state);
                setState(dynamic.name, prompt.name, generation);
            })));
            return store_1.useStore.getState();
        });
    },
    run(initialState, dynamic) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = {};
            const { state: storeState } = store_1.useStore.getState();
            state = Object.assign(Object.assign({}, storeState), initialState);
            if (dynamic.before) {
                logger_1.default.info("Running before hook");
                const beforeResult = (yield dynamic.before(state));
                state = Object.assign(Object.assign({}, state), beforeResult);
            }
            const strategy = dynamic.kind === "chainOfThought"
                ? this.runChainOfThought
                : this.runTreeOfThought;
            if (strategy) {
                state = Object.assign(Object.assign({}, state), (yield strategy(dynamic, state)));
            }
            else {
                logger_1.default.error("Unknown dynamic type");
                return {};
            }
            if (dynamic.after) {
                logger_1.default.info("Running after hook");
                const afterResult = (yield dynamic.after(state));
                state = Object.assign(Object.assign({}, state), afterResult);
            }
            return state;
        });
    },
};
