import { Request, Response, NextFunction } from "express";
import { CreateSubscriptionUseCase } from "../../../application/useCase/subscription.plans/Createsubscription.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CreateSubscriptionController {
  constructor(
    private readonly createSubscriptionUC: CreateSubscriptionUseCase,
  ) {}

  createSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    console.log("\n========== CREATE SUBSCRIPTION ==========");

    try {
      console.log("REQUEST URL:", req.originalUrl);
      console.log("REQUEST METHOD:", req.method);

      console.log("REQ.USER:", req.user);

      const recruiterId = req.user?.userId;

      console.log("RECRUITER ID:", recruiterId);

      console.log("REQ.BODY:", req.body);

      const planId = req.body?.planId;

      console.log("PLAN ID:", planId);
      console.log("PLAN ID TYPE:", typeof planId);

      if (!recruiterId) {
        console.error("NO RECRUITER ID FOUND");

        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!planId || typeof planId !== "string") {
        console.error("INVALID PLAN ID");

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "planId is required",
        });
      }

      console.log("CALLING CREATE SUBSCRIPTION USE CASE...");

      const result = await this.createSubscriptionUC.execute({
        recruiterId,
        planId,
      });

      console.log("USE CASE RESULT:", result);

      console.log("SUBSCRIPTION CREATED SUCCESSFULLY");
      console.log("========================================\n");

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription created successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("\n========== CREATE SUBSCRIPTION ERROR ==========");

      console.error("ERROR NAME:", err?.name);
      console.error("ERROR MESSAGE:", err?.message);

      if (err?.stack) {
        console.error("STACK TRACE:");
        console.error(err.stack);
      }

      console.error("FULL ERROR:", err);

      console.error("===============================================\n");

      next(err);
    }
  };
}