import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/presentation/auth.routes";
import candidateRoutes from "./modules/candidate/presentation/candidate.routes";
import recruiterRoutes from "./modules/recruiter";
import adminRouter from "./modules/admin";
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
app.use("/api/admin",adminRouter)

app.use(notFound);
app.use(errorHandler)
export default app;
