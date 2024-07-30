interface Logger {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

// Define a default logger using console to use if no custom logger is provided
const defaultLogger: Logger = {
  info: (message) => console.log(message),
  error: (message) => console.error(message),
  warn: (message) => console.warn(message),
};

export default {
  info(message: string, ...optionalParams: any[]) {
    console.log(`INFO: ${message}`, ...optionalParams);
  },

  error(message: string, ...optionalParams: any[]) {
    console.error(`ERROR: ${message}`, ...optionalParams);
  },

  debug(message: string, ...optionalParams: any[]) {
    console.debug(`DEBUG: ${message}`, ...optionalParams);
  },
};
