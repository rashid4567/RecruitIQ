import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { startSubscriptionScheduler } from "./modules/recruiter/infrastructure/cron/subscription-expiry.cron";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startSubscriptionScheduler();

  app.listen(PORT, () => {
    console.log(`server running in the http://localhost:${PORT}`);
  });
};

startServer();
