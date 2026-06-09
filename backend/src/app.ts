import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/presentation/routes/index";
import candidateRoutes from "./modules/candidate/presentation/routes/candidate.routes";
import recruiterRoutes from "./modules/recruiter/presentation/router/recruiter.routes";
import adminRoutes from "./modules/admin/Presentation/routes/admin.Routes";
import notificationRoutes from "./modules/notification/presentation/routes/notification.routes"
import { notFound } from "./shared/middlewares/notFound.middleware";
import { errorHandler } from "./shared/middlewares/error.middleware";
import { requestLogger } from "./shared/middlewares/requestLogger";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notification",notificationRoutes)

app.use(notFound);
app.use(errorHandler);

export default app;
