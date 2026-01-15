import type { AppContainer } from "../container/app.container";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "admin" | "recruiter" | "candidate";
      };
      container: AppContainer;
    }
  }
}

export {};
