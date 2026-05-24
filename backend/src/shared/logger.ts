import winston from "winston";
import fs from "fs";

const { combine, timestamp, printf, colorize, errors } = winston.format;

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const readableFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level}]: ${stack}`;
  }

  if (typeof message === "object") {
    return `${timestamp} [${level}]:\n${JSON.stringify(message, null, 2)}`;
  }

  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
  ),

  transports: [
    new winston.transports.Console({
      format: combine(colorize(), readableFormat),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],

  exitOnError: false,
});
