import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Print full error stack
    format.json()
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "log/error.log", level: "error" }), // Log errors to file
    new transports.File({ filename: "log/combined.log" }), // Log all logs to file
  ],
});

export default logger;
