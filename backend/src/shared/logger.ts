import winston from "winston";
import fs from "fs";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// create logs folder if not exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

/*
  Clean human readable format
*/
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
    errors({ stack: true })
  ),

  transports: [
    // console logs
    new winston.transports.Console({
      format: combine(colorize(), readableFormat),
    }),

    // error file logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // all logs file
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],

  exitOnError: false,
});
