"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define a default logger using console to use if no custom logger is provided
const defaultLogger = {
    info: (message) => console.log(message),
    error: (message) => console.error(message),
    warn: (message) => console.warn(message),
};
exports.default = {
    info(message, ...optionalParams) {
        console.log(`INFO: ${message}`, ...optionalParams);
    },
    error(message, ...optionalParams) {
        console.error(`ERROR: ${message}`, ...optionalParams);
    },
    debug(message, ...optionalParams) {
        console.debug(`DEBUG: ${message}`, ...optionalParams);
    },
};
