import { Request, Response, NextFunction } from "express";
import { GetApplicationDetailUseCase } from "../../../application/usecase/candidate/GetApplicationDetailUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  ApplicationDetailResponseDTO,
  GetApplicationDetailRequestDTO,
} from "../../../application/dto/application-detail.response.dto";

export class GetApplicationDetailController {
  constructor(
    private readonly getApplicationDetailUC: UseCase<
      GetApplicationDetailRequestDTO,
      ApplicationDetailResponseDTO
    >,
  ) {}

  ApplicationDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { applicationId } = req.params;
      if (!applicationId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.APPLICATION_REQUIRED,
        });
      }
      const application = await this.getApplicationDetailUC.execute({
        candidateId,
        applicationId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        messaage: SUCCESS_MESSAGES.APPLICATION_LOADED_SUCCESSFULLY,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  };
}
