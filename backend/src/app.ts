import express from "express";
import cors from "cors";
import  authRoutes  from "./auth";
import cookieParser from "cookie-parser";
import candidateRoute from "./candidate";
import recruiterRoute from "./recruiter/index"
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/candidate",candidateRoute)
app.use("/api/recruiter",recruiterRoute)
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is connected" });
});

export default app;
