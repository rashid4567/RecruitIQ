import { Router } from "express";
import { googleController } from "../container/auth.container";

const router = Router();

router.post("/google/login", (req, res, next) => {
  console.log("hit google router");
  next();
}, googleController.login);

export default router;
