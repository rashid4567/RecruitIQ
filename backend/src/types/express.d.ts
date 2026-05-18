import type { AppContainer } from "../container/app.container";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: "admin" | "recruiter" | "candidate";
    };
    container: AppContainer;
    requestId: string;
  }
}