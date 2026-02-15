import { Request, Response, NextFunction } from "express";
import { logger } from "../shared/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(`
${req.method} ${req.originalUrl}
Body: ${JSON.stringify(req.body)}
Status: ${res.statusCode} (${duration}ms)
    `);
  });

  next();
};
