import { Request, Response, NextFunction } from "express";
import { WithdrawApplicationUseCase } from "../../../application/usecase/candidate/WithdrawApplicationUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";

export class WithdrawApplicationController {
  constructor(
    private readonly withdrawApplicationUC: WithdrawApplicationUseCase,
  ) {}

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { applicationId } = req.params;
      console.log(
        "WITHDRAW API HIT:",
        req.params.applicationId,
        new Date().toISOString(),
      );
      if (!applicationId) {
        return res.send(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.APPLICATION_REQUIRED,
        });
      }

      await this.withdrawApplicationUC.execute(applicationId, candidateId);
    } catch (err) {
      next(err);
    }
  };
}
