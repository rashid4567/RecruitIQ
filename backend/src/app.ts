import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./auth";
import candidateRoutes from "./candidate";
import recruiterRoutes from "./recruiter";
import adminRouter from "./admin";

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
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is connected",
  });
});

export default app;
