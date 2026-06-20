import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { WithdrawApplicationRequestDTO } from "../../../application/dto/withdrawApplication.dto";

export class WithdrawApplicationController {
  constructor(
    private readonly withdrawApplicationUC: UseCase<
      WithdrawApplicationRequestDTO,
      void
    >,
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

      await this.withdrawApplicationUC.execute({ applicationId, candidateId });
    } catch (err) {
      next(err);
    }
  };
}
