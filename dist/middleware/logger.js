"use strict";
// Define a default logger using console to use if no custom logger is provided
const defaultLogger = {
    info: (message) => console.log(message),
    error: (message) => console.error(message),
    warn: (message) => console.warn(message),
};
