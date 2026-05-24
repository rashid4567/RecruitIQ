import winston from "winston";
import fs from "fs";
import path from "path";
const LOG_DIR = path.join(process.cwd(), "logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, {
    recursive: true,
  });
}

const { combine, timestamp, json } = winston.format;
export const winstonLogger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, "activity.log"),
    }),
    new winston.transports.Console(),
  ],
});
