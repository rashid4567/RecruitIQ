import winston from "winston";

const { combine, timestamp, json, errors } = winston.format;

export const winstonLogger = winston.createLogger({
  level: "info",

  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/activity.log",
    }),

    new winston.transports.Console(),
  ],
});
