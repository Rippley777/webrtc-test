const winston = require("winston");
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Define custom colors for different log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    secondary: 5,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
    secondary: "grey",
  },
};

// Apply custom colors to winston
winston.addColors(customLevels.colors);

// Define the custom format for logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger instance
module.exports.loggerFileOnly = createLogger({
  levels: customLevels.levels,
  level: "debug", // Change to 'debug' for more detailed logs
  format: combine(
    colorize({ all: true }), // Apply colors to the entire log message
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: "../../../../../combined.log" }),
  ],
});

const logger = createLogger({
  levels: customLevels.levels,
  level: "debug",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "../../../combined.log" }),
  ],
});

// Export the logger
module.exports = logger;
