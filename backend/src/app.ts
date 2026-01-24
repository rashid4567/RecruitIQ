import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/presentation/routes/auth.routes";
import candidateRoutes from "./modules/candidate/presentation/routes/candidate.routes";
import recruiterRoutes from "./modules/recruiter/presentation/router/recruiter.routes";
import adminCandidateRouters from "./modules/admin/candidate/Presentation/candidate.routes"
import adminRecruiterRouters from "./modules/admin/Recruiter/presentation/recruiter.routes"
import adminEmailTemplateRouter from "./modules/admin/email-template/presentation/email-templete.routes";
import adminEmailLoger from './modules/admin/email.logs/presentation/routes/email-logs.routes'
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin/candidates", adminCandidateRouters);
app.use("/api/admin/recruiters", adminRecruiterRouters);
app.use("/api/admin/email-templates",adminEmailTemplateRouter);
app.use("/api/admin/email-logs",adminEmailLoger);

app.use(notFound);
app.use(errorHandler)
export default app;
