import { Request, Response, NextFunction } from "express";
import { logger } from "../shared/logger/logger";
import { randomUUID } from "crypto";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = randomUUID();
  const start = Date.now();

  req.requestId = requestId;

  const log = logger.child({
    requestId,
    method: req.method,
    path: req.originalUrl,
  });

  res.on("finish", () => {
    log.info({
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
};
