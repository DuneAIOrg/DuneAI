// Logger interface
interface Logger {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  // Add other necessary log methods or levels you want to support
}

// Define a default logger using console to use if no custom logger is provided
const defaultLogger: Logger = {
  info: (message) => console.log(message),
  error: (message) => console.error(message),
  warn: (message) => console.warn(message),
};
