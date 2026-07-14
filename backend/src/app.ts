import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/presentation/routes/index";
import candidateRoutes from "./modules/candidate/presentation/routes/candidate.routes";
import recruiterRoutes from "./modules/recruiter/presentation/router/recruiter.routes";
import adminRoutes from "./modules/admin/Presentation/routes/admin.Routes";
import notificationRoutes from "./modules/notification/presentation/routes/notification.routes";

import { notFound } from "./shared/middlewares/notFound.middleware";
import { errorHandler } from "./shared/middlewares/error.middleware";
import { requestLogger } from "./shared/middlewares/requestLogger";
import { API_ROUTES } from "./shared/constants/api-routes.constants";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.CANDIDATE, candidateRoutes);
app.use(API_ROUTES.RECRUITER, recruiterRoutes);
app.use(API_ROUTES.ADMIN, adminRoutes);
app.use(API_ROUTES.NOTIFICATION, notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
